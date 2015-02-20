// AGPLv3 or later
// Copyright (c) 2015 Genome Research Limited

// Specific ldapjs imports
var parseFilter       = require('ldapjs').parseFilter,
    NoSuchObjectError = require('ldapjs').NoSuchObjectError;

// Base URL for upstream
var baseURL = process.env.RPBASE || '';

// Load and transform the route map
var routeMap = (function(src) {
  var mapping      = require(src),
      allowedScope = ['base', 'sub', 'one', 'childern'];

  // Parameterised DN, using :bind variables
  var paramDN = function(dn) {
    return function(params) {
      var output = dn;

      // Bind all parameter values
      if (params) {
        for (param in params) {
          if (params.hasOwnProperty(param)) {
            var reParam = new RegExp(':' + param + '(?=\\b)', 'g');
            output = output.replace(reParam, params[param]);
          }
        }
      }

      return output;
    };
  }

  // Parameterise each route map, normalise scope and rebase profile URL
  // n.b. mapping is just JSON, so we don't have to do hasOwnProperty
  for (route in mapping) {
    mapping[route].dn = paramDN(mapping[route].dn);

    if (allowedScope.indexOf(mapping[route].scope) == -1) {
      mapping[route].scope = 'base';
    }

    if (baseURL) {
      mapping[route].profile = baseURL + mapping[route].profile;
    }
  }

  return mapping;
})('./mapping.json');

// Transpose the route map so we can convert DNs to URLs
// Once transposed, the bind variables in the DN are converted into
// regexp capture groups and respectively referenced in the URL.
var dnToURL = (function(r) {
  var transpose = (function() {
    var output = [];
    
    // Unique elements in array
    var unique = function(arr) {
      var seen = {}
      return arr.filter(function(i) {
        return seen.hasOwnProperty(i) ? false : (seen[i] = true);
      });
    };

    for (route in r) {
      // Get back the parameterised DN and the list of parameters
      // Plus we want a copy of the route to play with
      var dn       = r[route].dn(),
          bindVars = unique(dn.match(/:\w+/g) || []),
          url      = route.toString();

      // Go through each parameter to create a replacement map
      bindVars.forEach(function(v, i) {
        var ri = i + 1,
            re = new RegExp(v + '(?=\\b)', 'g');

        // Replace first occurrence in DN with capture group
        dn = dn.replace(v, '(.*)');

        // Replace any additional occurrences in DN with backref
        dn = dn.replace(re, '\\' + ri);

        // Replace all occurrences in URL with reference
        url = url.replace(re, '$' + ri);
      });

      output.push({
        dn:  new RegExp('^' + dn + '$'),
        url: baseURL + url
      });
    }

    return output;
  })();

  return function convert(val, rel) {
    if (Array.isArray(val)) {
      // Iterate over arrays
      return val.map(function(e) {
        return convert(e, rel);
      });

    } else {
      for (t in transpose) {
        var transform = transpose[t];

        // We've got a routed DN, so augment it with a hyperlink
        if (transform.dn.test(val)) {
          return {
            dn:   val,
            href: val.replace(transform.dn, transform.url),
            rel:  rel
          };
        }
      }

      // Otherwise, just pass-through
      return val;
    }
  };
})(routeMap);

// Attribute filter
// The ldapjs output always includes `dn` and `controls` members, the
// latter is useless for our purposes and so should be discarded. For
// binary data, we should base64 encode it; there's no easy way to
// determine this, so we cheat and check known binary attribute names.
var attrFilter = (function() {
  var attrClass = (function() {
    var classes = {
      blacklist: ['controls'],
      binary:    ['jpegPhoto', /;binary$/]
    };

    // Convert any strings (above) into regular expressions
    for (filter in classes) {
      classes[filter] = classes[filter].map(function(t) {
        if (typeof t == 'string') {
          return new RegExp('^' + t + '$');
        } else {
          return t;
        }
      });
    };

    return function(key) {
      for (filter in classes) {
        if (classes[filter].some(function(t) { return t.test(key); })) {
          return filter;
        }
      }
    };
  })();
  
  return function(entry) {
    var attrs  = Object.keys(entry.object),
        output = {};

    attrs.forEach(function(key) {
      switch (attrClass(key)) {
        case 'blacklist':
          // Do nothing
          break;

        case 'binary':
          output[key] = entry.raw[key].toString('base64');
          break;

        default:
          output[key] = dnToURL(entry.object[key],
                                key == 'dn' ? 'self' : key);
          break;
      }
    });

    return output;
  };
})();

module.exports = function(app, ldap) {
  // Set up routing
  for (route in routeMap) (function(r) {
    app.get(r, function(req, res, next) {
      var dn      = routeMap[r].dn(req.params),
          profile = routeMap[r].profile,
          options = {
            scope:      routeMap[r].scope,
            attributes: routeMap[r].attrs
          }

      // Parse query string for specific attributes
      if (req.query.attrs) {
        if (req.query.attrs == '*') {
          options.attributes = undefined;
        } else {
          options.attributes = req.query.attrs.split(',');
        }
      }

      // Parse query string for filter
      if (req.query.q) {
        try {
          options.filter = parseFilter(req.query.q);
        }
        catch(err) {
          // Handle invalid filter
          next({
            status:    400,
            message:   'Invalid filter',
            exception: err
          });

          return;
        }
      }

      // Flow control flags for async LDAP
      var found       = false,
          chunk       = options.scope != 'base',
          sendHeaders = function() {
            // Everything is JSON
            // Everything is cool when you're part of a team
            res.set('Content-Type', 'application/json');

            // Linked profile, if available
            if (profile) {
              res.set('Link', '<' + profile + '>;rel=profile');
            }
            
            // Chunked encoding only for non-base scope
            if (chunk) {
              res.set('Transfer-Encoding', 'chunked');
            }
          };

      ldap.search(dn, options, function(err, ldapRes) {
        if (err) {
          // Some horrible LDAP error... oh the humanity!
          next({
            status:    500,
            message:   err.message,
            exception: err
          });

          return;
        }

        ldapRes.on('searchEntry', function(entry) {
          if (!found) {
            sendHeaders();

            // Write JSON open array
            if (chunk) { res.write('['); }
          }

          // Write JSON array element separator
          if (found && chunk) { res.write(','); }

          // Write JSON object
          res.write(JSON.stringify(attrFilter(entry)));

          found = true;
        });

        ldapRes.on('end', function(result) {
          // Write JSON close array
          if (found && chunk) { res.write(']'); }
          res.end();
        });

        ldapRes.on('error', function(err) {
          if (err instanceof NoSuchObjectError) {
            next({
              status:    404,
              message:   'No such object in LDAP directory',
              exception: err
            });

          } else {

            var message = err.toString();

            // Append error object to output, if data has already been
            // transmitted. Otherwise, fallback to general error handler
            if (res.headersSent) {
              if (found && chunk) { res.write(','); }
              res.write(JSON.stringify({ error: message }));
              if (found && chunk) { res.write(']'); }
              res.end();
            } else {
              next({
                status:    500,
                message:   message,
                exception: err
              });
            }
          }
        });
      });
    });
  })(route);

  // Catch all for anything else
  app.get('*', function(req, res, next) {
    next({
      status:   404,
      message: 'No such route'
    });
  });
};
