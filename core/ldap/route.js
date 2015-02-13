// AGPLv3 or later
// Copyright (c) 2015 Genome Research Limited

// Specific ldapjs imports
var parseFilter       = require('ldapjs').parseFilter,
    LDAPError         = require('ldapjs').LDAPError,
    NoSuchObjectError = require('ldapjs').NoSuchObjectError;

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
            var reParam = new RegExp(':' + param + '(?=\\W)', 'g');
            output = output.replace(reParam, params[param]);
          }
        }
      }

      return output;
    };
  }

  // Parameterise each route map and normalise scope
  // n.b. mapping is just JSON, so we don't have to do hasOwnProperty
  for (route in mapping) {
    mapping[route].dn = paramDN(mapping[route].dn);

    if (allowedScope.indexOf(mapping[route].scope) == -1) {
      mapping[route].scope = 'base';
    }
  }

  return mapping;
})('./mapping.json');

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
          output[key] = entry.object[key];
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
          chunk       = routeMap[r].scope != 'base',
          sendHeaders = function() {
            app.set('Content-Type', 'application/json');
            if (chunk) { app.set('Transfer-Encoding', 'chunked'); }
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
