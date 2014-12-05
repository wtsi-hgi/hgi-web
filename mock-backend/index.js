var express = require('express');
var app = express();

var routes = {
  '/': {
    get: function(req, res) {
      res.type('json');
      res.send('"Hello world!"');
    }
  },

  '/foo': {
    post: function(req, res) {
      res.send();
    }
  }
};

Object.keys(routes).forEach(function(route) {
  var routeVerbs = Object.keys(routes[route]);

  // Catch all middleware for 405s
  app.all(route, function(req, res, next) {
    var verb = req.method.toLowerCase();

    if (verb == 'options' || routeVerbs.indexOf(verb) != -1) {
      next();

    } else {
      // Not cool
      res.status(405).send();
    }
  });

  // Set up OPTIONS handler
  app.options(route, function(req, res) {
    var allow = routeVerbs.map(function(x) { return x.toUpperCase(); })
                          .concat('OPTIONS')
                          .join(',');

    res.set('Allow', allow);
    res.send();
  });

  // Set defined request handlers
  routeVerbs.forEach(function(verb) {
    app[verb](route, routes[route][verb]);
  });
});

// Start server
var server = app.listen(3000, function() {
  console.log('listening...');
});
