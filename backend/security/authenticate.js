// AGPLv3 or later
// Copyright (c) 2014 Genome Research Limited

// Load private key and initialise token codec
var fs         = require('fs'),
    privateKey = fs.readFileSync(process.env.KEYFILE),
    xiongxiong = require('xiongxiong')(privateKey);

module.exports = function(req, res, next) {
  var auth = (req.headers.authorization || '').split(' '),
      token;

  switch (auth[0].toLowerCase()) {
    case 'bearer':
      // Decode bearer token
      token = xiongxiong.decode(auth[1]);
      break;

    case 'basic':
      // Decode basic auth pair
      var basicPair = (new Buffer(auth[1], 'base64')).toString().split(':');
      token = xiongxiong.decode(basicPair[0], basicPair[1]);
      break;

    default:
      token = { valid: false };
      break;
  }

  if (token.valid) {
    // We're good!
    // Thread decoded token data through all requests
    req.token = token;
    next();

  } else {
    // Fall back to prompting for basic auth pair
    res.set('WWW-Authenticate', 'Basic');
    res.status(401).send('Cannot authenticate');
  }
};
