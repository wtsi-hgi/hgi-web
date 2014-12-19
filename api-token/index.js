#!/usr/bin/env node

// Bearer Token CGI Provider

// This started life as a Node.js upstream server port of the original
// Perl CGI provider (https://github.com/wtsi-hgi/hgi-web_apitoken), but
// running upstream introduces a security hole. To patch that, it's been
// reimplemented (in a "sunk cost fallacy" kind of way) as a CGI script.
// Bit weird, but what can you do!?

// AGPLv3 or later
// Copyright (c) 2014 Genome Research Limited

var fs     = require('fs');
    crypto = require('crypto');

// HTTP response writing interface
var httpWrite = (function() {
  var stdout = process.stdout,
      eol    = '\r\n';

  // Expand as necessary...
  // http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
  var httpStatus = {
    '200': 'OK',
    '405': 'Method Not Allowed',
    '406': 'Not Acceptable',
    '407': 'Proxy Authentication Failed',
    '500': 'Internal Server Error'
  };

  var headersSent      = false,
      AlreadySentError = new Error('Headers already sent');

  var html = {'Content-Type': 'text/html'};

  return {
    // Simple templating engine
    template: (function() {
      var templates = {
        '_error': '<html><head><title>{{status}} {{response}}</title></head>' +
                  '<body><h1>{{response}}</h1><p>{{body}}</p></body></html>'
      };

      var engine = function(id, data) {
        var output = templates[id] || 'No such template';

        // Merge keys
        for (key in data) {
          if (data.hasOwnProperty(key)) {
            var findKey = new RegExp('{{' + key + '}}', 'g');
            output = output.replace(findKey, data[key]);
          }
        }

        return output;
      };

      // Create a new template
      engine.create = function(/* [id,] template */) {
        switch (arguments.length) {
          case 1:
            // Add multiple templates by hash
            for (id in arguments[0]) {
              if (arguments[0].hasOwnProperty(id)) {
                templates[id] = arguments[0][id];
              }
            }
            break;

          case 2:
            // Add single template by ID
            templates[arguments[0]] = arguments[1];
            break;

          default:
            break;
        }
      };

      return engine;
    })(),

    // Write HTTP headers
    headers: function(status, headerData) {
      if (!headersSent) {
        // Write HTTP status
        stdout.write('Status: ' + status + ' ' + httpStatus[status] + eol);

        // Write header data
        for (header in headerData) {
          if (headerData.hasOwnProperty(header)) {
            stdout.write(header + ': ' + headerData[header] + eol);
          }
        }

        stdout.write(eol);
        headersSent = true;

      } else {
        throw AlreadySentError;
      }
    },
    
    // Write HTTP response
    body: function(/* [template,] data */) {
      var output;

      if (!headersSent) {
        // Default header
        this.headers(200, html);
      }

      switch (arguments.length) {
        case 1:
          // Write raw data
          output = arguments[0];
          break;

        case 2:
          // Write template
          output = this.template(arguments[0], arguments[1]);
          break;

        default:
          break;
      }

      stdout.write(output);
    },

    // Write standard error response
    error: function(status, body) {
      if (!headersSent) {
        this.headers(status, html);
        this.body('_error', {
          status:   status,
          response: httpStatus[status],
          body:     body
        });

        process.exit(status);
      
      } else {
        throw AlreadySentError;
      }
    }
  };
})();

// Output templates
httpWrite.template.create({
  text: 'tokenType=bearer&' +
        'expiration={{expiration}}&' + 
        'accessToken={{accessToken}}&' +
        'basicLogin={{basicLogin}}&' +
        'basicPassword={{basicPassword}}',

  json: '{"tokenType":"bearer",' +
        '"expiration":{{expiration}},' +
        '"accessToken":"{{accessToken}}",' +
        '"basicLogin":"{{basicLogin}}",' +
        '"basicPassword":"{{basicPassword}}"}',

  html: '<html><head><title>API Token</title></head><body><dl>' +
        '<dt>tokenType</dt><dd>bearer</dd>' +
        '<dt>expiration</dt><dd>{{expiration}}</dd>' +
        '<dt>accessToken</dt><dd>{{accessToken}}</dd>' +
        '<dt>basicLogin</dt><dd>{{basicLogin}}</dd>' +
        '<dt>basicPassword</dt><dd>{{basicPassword}}</dd>' +
        '</dl></body></html>',

  xml:  '<?xml version="1.0" encoding="UTF-8"?>' +
        '<OAuth>' +
        '<tokenType>bearer</tokenType>' +
        '<expiration>{{expiration}}</expiration>' +
        '<accessToken>{{accessToken}}</accessToken>' +
        '<basicLogin>{{basicLogin}}</basicLogin>' +
        '<basicPassword>{{basicPassword}}</basicPassword>' +
        '</OAuth>'
});

// Construct XHTML template rather than repeating ourselves
(function() {
  var html = httpWrite.template('html');
  httpWrite.template.create('xhtml',
    '<?xml version="1.0" encoding="UTF-8"?>' + 
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
    html.replace('<head>', '<head xmlns="http://www.w3.org/1999/xhtml">')
  ); 
})();

// Load private key
// n.b., KEYFILE must be set in httpd.conf
try {
  var privateKey = fs.readFileSync(process.env.KEYFILE);
} catch(err) {
  httpWrite.error(500, 'Could not load private key: ' + err.message);
}

// Async bearer token generator
var xiongxiong = require('xiongxiong')(privateKey, process.env.LIFETIME);

// Shibboleth authentication attributes
var shibboleth = (process.env['AUTH_TYPE'] == 'shibboleth'),
    ePPN       = process.env['eppn'],
    sessionID  = process.env['Shib_Session_ID'];

if (process.env['REQUEST_METHOD'] == 'GET') {
  if (shibboleth && ePPN && sessionID) {
    // We're good to go :)
    xiongxiong.create([ePPN, sessionID], function(err, token) {
      if (err) {
        httpWrite.error(500, err.message);

      } else {
        var accept = process.env['HTTP_ACCEPT'],
            contentType, template;

        // Parse Accept header
        accept.split(',').some(function(accept) {
          contentType = accept.split(';')[0].trim();

          switch(contentType) {
            case '*/*':
            case 'application/*':
              contentType = 'application/json';
            case 'application/json':
              template = 'json';
              break;

            case 'application/xml':
            case 'text/xml':
              template = 'xml';
              break;

            case 'text/*':
              contentType = 'text/plain';
            case 'text/plain':
              template = 'text';
              break;

            case 'text/html':
              template = 'html';
              break;

            case 'application/xhtml+xml':
              template = 'xhtml';
              break;

            default:
              break;
          }

          return template
        });

        if (!template) {
          httpWrite.error(406, accept);

        } else {
          // Output token data as response
          httpWrite.headers(200, {
            'Content-Type':  contentType,
            'Cache-Control': 'no-store',
            'Pragma':        'no-cache'
          });
          httpWrite.body(template, token);
        }
      }
    });

  } else {
    // Shibboleth attributes not available
    httpWrite.error(407, 'Shibboleth attributes missing');
  }

} else {
  // Must GET token
  httpWrite.error(405, 'Can only GET token');
}
