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
      token = xiongxiong.extract(auth[1]);
      break;

    case 'basic':
      // Decode basic auth pair
      var basicPair = (new Buffer(auth[1], 'base64')).toString().split(':');
      token = xiongxiong.extract(basicPair[0], basicPair[1]);
      break;

    default:
      break;
  }

  if (token && token.isValid()) {
    // We're good!
    // Thread extracted token data through all requests
    req.token = token;
    next();

  } else {
    // Fall back to prompting for basic auth pair
    res.set('WWW-Authenticate', 'Basic');
    res.status(401).send('Cannot authenticate');
  }
};
