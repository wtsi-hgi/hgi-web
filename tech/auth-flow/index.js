// Minimal Authentication Flow Server

// MIT License
// Copyright (c) 2015 Genome Research Limited

var express = require('express'),
    app     = express();

app.set('views', __dirname + '/templates')
app.set('view engine', 'jade');

// Login credentials
var credentials = {
  username: 'abc123',
  password: 'f00bar'
};

// Basic authentication data
credentials.basic = new Buffer([credentials.username,
                                credentials.password]
                               .join(':')).toString('base64');

var checkAuth = function(req) {
  var passed = false;
  if (req.headers.authorization) {
    var auth = req.headers.authorization.split(' ');
    passed = auth[0].toLowerCase() == 'basic'
             && auth[1] == credentials.basic;
  }
  return passed;
}

app.use('/assets', express.static('assets'));

app.get('/', function(req, res) {
  // Check to see if the correct basic authentication data has been
  // included in the request header. If it has, then we've passed
  // authentication, which indicates to the template that it shouldn't
  // redirect noscript clients to the manual authentication flow.
  // If authentication data is not present, or fails, then we don't do
  // anything (i.e., no 401): that will be deferred to the next step,
  // where noscript clients will get forwarded into the manual flow and
  // JavaScript clients will do everything automatically.
  var passed = checkAuth(req);
  res.render('index', {
    authenticated: passed,
    auth:          req.headers.authorization
  });
});

app.get('/manual-guide', function(req, res) {
  // Instructions for the user to do manual authentication, plus the
  // required credentials (from /token)
  if (checkAuth(req)) {
    res.redirect('/');
  
  } else {
    res.render('manual');
  }
});

app.get('/manual-auth', function(req, res) {
  // This end point should never be accessed by JavaScript clients. For
  // noscript clients, it just prompts for basic authentication and,
  // if it passes, redirects back to /
  if (checkAuth(req)) {
    res.redirect('/');

  } else {
    res.set('WWW-Authenticate', 'Basic');
    res.status(401).render('manual');
  }
});

app.get('/token', function(req, res) {
  // Return the authorisation credentials as either JSON (for
  // JavaScript) or HTML (for noscript/human consumption).
  switch(req.accepts(['json', 'html'])) {
    case 'json':
      res.send(credentials);
      break;

    case 'html':
      res.render('token', credentials);
      break;

    default:
      res.status(406).send('Not Acceptable');
  }
});

app.get('/api', function(req, res) {
  // RESTful API stub
  var passed = checkAuth(req);
  if (passed) {
    var data = {foo: 'bar', t: Date.now()};

    switch(req.accepts(['json', 'html'])) {
      case 'json':
        res.send(data);
        break;

      case 'html':
        res.render('index', {
          authenticated: passed,
          auth:          req.headers.authorization,
          api:           data
        });
        break;

      default:
        res.status(406).send('Not Acceptable');
    }
  } else {
    res.status(401).send('Cannot authenticate');
  }
});

app.listen(3000, function() {
  console.log('listening');
});
