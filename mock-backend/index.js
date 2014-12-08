// Quick'n'Dirty Mock API Server
// n.b., This only allows for hardcoded and parameterised routes
// ...No regexps :(

// AGPLv3 or later
// Copyright (c) 2014 Genome Research Limited

var express = require('express'),
    app     = express();

var routes  = require('./routes'),
    allowed = ('get,post,put,head,delete,trace,copy,lock,mkcol,move,' + 
              'purge,propfind,proppatch,unlock,report,mkactivity,' +
              'checkout,merge,m-search,notify,subscribe,unsubscribe,' +
              'patch,search,connect').split(',');

// Authentication and authorisation
var authenticate = require('./authenticate'),
    authorise    = require('./authorise'),
    youreGood    = function(req, res, next) { next(); };

// Set up route handlers
Object.keys(routes).forEach(function(route) {
  var routeVerbs = Object.keys(routes[route]);

  // Catch all middleware for 401 and 405s
  app.all(route, authenticate, function(req, res, next) {
    var verb = req.method.toLowerCase();

    if (verb == 'options' || routeVerbs.indexOf(verb) != -1) {
      next();

    } else {
      // Not cool
      res.status(405).send('Method Not Allowed');
    }
  });

  // Set up OPTIONS handler
  app.options(route, function(req, res) {
    var allow = routeVerbs.join(',').toUpperCase() + ',OPTIONS';

    res.set('Allow', allow);
    res.send();
  });

  // Set defined request handlers
  routeVerbs.forEach(function(verb) {
    // Fail on unhandlable verb
    // n.b., We explicitly disallow OPTIONS, because we sort that out
    // ourselves automagically (i.e., see above)
    if (allowed.indexOf(verb) == -1) {
      throw new Error('I do not know how to \'' + verb.toUpperCase() + '\' ' + route)
    }

    // Authorisation middleware follows same schema as routing, with the
    // exception that omitted route/verb combinations in the data
    // structure are vacuously authorised
    app[verb](route, (authorise[route] && authorise[route][verb]) || youreGood,
                     routes[route][verb]);
  });
});

// Start server
var server = app.listen(3000, function() {
  console.log('listening...');
});
