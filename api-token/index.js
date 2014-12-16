// Bearer Token Provider
// This is a Node.js port of https://github.com/wtsi-hgi/hgi-web_apitoken

// AGPLv3 or later
// Copyright (c) 2014 Genome Research Limited

// Setup environment
require('node-env-file')(__dirname + '/.env');

// Foo
var http   = require('http'),
    fs     = require('fs'),
    crypto = require('crypto');

// Load private key
var privateKey = fs.readFileSync(process.env.KEYFILE);

// Invalid request handler
var BadRequest = function(message) {
  this.message = message;
};

BadRequest.prototype = Object.create(Error.prototype);
BadRequest.prototype.constructor = BadRequest;
BadRequest.prototype.name = 'BadRequest';

BadRequest.prototype.handle = function(req, res) {
  res.writeHead(400, 'Bad Request', {'Content-Type': 'text/html'});
  res.end('Bad Request: ' + this.message);
};

// Async bearer token generator
var bearerToken = function(user, session, callback) {
  // Create a 48-bit salt
  crypto.randomBytes(6, function(err, salt) {
    if (err) {
      callback(err, null);
    
    } else {
      var hmac       = crypto.createHmac('sha1', privateKey),
          expiration = Math.floor(Date.now() / 1000) + parseInt(process.env.LIFETIME, 10),
          message    = [user, expiration, session, salt.toString('base64')].join(':'),
          password;
      
      // Generate SHA1 HMAC of user:expiration:session:salt
      hmac.setEncoding('base64');
      hmac.write(message);
      hmac.end();
      password = hmac.read();

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
  if (req.method == 'GET') {
   // if (req.headers['x-auth-type']       == 'shibboleth'
   //  && req.headers['x-eppn']            != ''
   //  && req.headers['x-shib-session-id'] != '') {

    res.writeHead(200, {'Content-Type': 'text/html'});
    
    bearerToken('ch12@sanger.ac.uk', '_4628e2e4fd15572be6211045eab2e427', function(err, token) {
      res.write('<pre>' + JSON.stringify(token, null, '  ') + '</pre>');
      res.end();
    });


   // } else {
   //   // Shibboleth attributes not available
   //   (new BadRequest('Shibboleth attributes unavailable')).handle(req, res);
   // }
  } else {
    // Must GET token
    (new BadRequest('I only know how to GET')).handle(req, res);
  }
})

// Start provider
.listen(process.env.PORT, function() {
  console.log('Bearer token provider listening on %d', process.env.PORT); 
});
