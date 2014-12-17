// Bearer Token Provider
// This is a Node.js port of https://github.com/wtsi-hgi/hgi-web_apitoken

// AGPLv3 or later
// Copyright (c) 2014 Genome Research Limited

// Setup environment
require('node-env-file')(__dirname + '/.env');

var http   = require('http'),
    fs     = require('fs'),
    crypto = require('crypto');

// Load private key
var privateKey = fs.readFileSync(process.env.KEYFILE);

// Error handling
var HTTPError = function(status, message) {
  this.status  = status;
  this.message = message;
};

HTTPError.prototype = Object.create(Error.prototype);
HTTPError.prototype.constructor = HTTPError;
HTTPError.prototype.name = 'HTTPError';

// Expand as necessary...
// http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
HTTPError.prototype.httpStatus = {
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '407': 'Proxy Authentication Failed',
  '500': 'Internal Server Error'
};

HTTPError.prototype.handle = function(req, res) {
  var reason  = this.httpStatus[this.status] || 'Unknown Error',
      message = reason;

  if (this.message) { message += ': ' + this.message; }

  res.writeHead(this.status, reason, {'Content-Type': 'text/html'});
  res.end(message);
};

// Templating for output
var template = (function() {
  var templates = {
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

    html: '<head><title>API Token</title></head>' +
          '<body><dl>' +
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
  };

  templates.xhtml =
    '<?xml version="1.0" encoding="UTF-8"?>' + 
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' + 
    '<html xmlns="http://www.w3.org/1999/xhtml">' + templates.html;

  templates.html = '<html>' + templates.html;

  return function(template, data) {
    var output = templates[template] || 'No such template';

    for (key in data) {
      if (data.hasOwnProperty(key)) {
        var findKey = new RegExp('{{' + key + '}}', 'g');
        output = output.replace(findKey, data[key]);
      }
    }

    return output;
  };
})();

// Accept Content-Type mapping
var acceptMap = {
  'application/json':      'json',
  'application/xhtml+xml': 'xhtml',
  'application/xml':       'xml',
  'text/html':             'html',
  'text/plain':            'text',
  'text/xml':              'xml'
}

// Async bearer token generator
var bearerToken = function(user, session, callback) {
  // Create a 48-bit salt
  crypto.randomBytes(6, function(err, salt) {
    if (err) {
      callback(err, null);
    
    } else {
      var hmac       = crypto.createHmac('sha1', privateKey),
          expiration = Math.floor(Date.now() / 1000) + parseInt(process.env.LIFETIME, 10),
          message    = [user, expiration, session, salt.toString('base64')].join(':');
      
      // Generate SHA1 HMAC of user:expiration:session:salt
      hmac.setEncoding('base64');
      hmac.end(message);
      var password = hmac.read();

      // Return token and basic authentication pair
      callback(null, {
        expiration:    expiration,  // Unix epoch
        accessToken:   (new Buffer([message, password].join(':'))).toString('base64'),
        basicLogin:    (new Buffer(message)).toString('base64'),
        basicPassword: password
      });
    }
  });
};

// Create provider
http.createServer(function(req, res) {
  // These request headers need to be passed through from the reverse
  // proxy's respective environment variables
  var authType = req.headers['x-auth-type'],
      eppn     = req.headers['x-eppn'],
      session  = req.headers['x-shib-session-id'];

  if (req.method == 'GET') {
    if (authType /* == 'shibboleth' */ && eppn && session) {
      // We're good to go :)
      bearerToken(eppn, session, function(err, token) {
        if (err) {
          (new HTTPError(500, err.message)).handle(req, res);

        } else {
          var contentType = req.headers.accept,
              handler     = acceptMap[contentType];

          if (!handler) {
            (new HTTPError(406)).handle(req, res);

          } else {
            res.writeHead(200, {
              'Content-Type':  contentType,
              'Cache-Control': 'no-store',
              'Pragma':        'no-cache'
            });
            res.end(template(handler, token));
          }
        }
      });

    } else {
      // Shibboleth attributes not available
      (new HTTPError(407, 'Shibboleth attributes unavailable')).handle(req, res);
    }
  } else {
    // Must GET token
    (new HTTPError(405)).handle(req, res);
  }
})

// Start provider
.listen(process.env.PORT, function() {
  console.log('Bearer token provider listening on %d', process.env.PORT); 
});
