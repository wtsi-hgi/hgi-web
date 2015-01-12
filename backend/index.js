// Quick'n'Dirty API Server
// n.b., This only allows for hardcoded and parameterised routes
// ...No regexps, but globbing is still good

// AGPLv3 or later
// Copyright (c) 2014 Genome Research Limited

// Setup environment
require('node-env-file')(__dirname + '/.env');

// Main application imports
var mongo   = require('mongodb').MongoClient,
    express = require('express'),
    app     = express();

// Connect to the Mongo instance and thread the connection pool through
// all our middleware functions before starting the API server
mongo.connect(process.env.DB_SOURCE, function(err, db) {
  if (err) { throw err; }
  console.log('Connected to %s API database', db.databaseName);

  // Thread DB through all requests
  app.use(function(req, res, next) {
    req.db = db;
    next();
  });

  // Middleware
  var security = require('./security'),
      morgan   = require('morgan');

  // Logging
  app.use(morgan(process.stdout.isTTY ? 'dev' : 'combined'));

  // Routing
  var routes  = require('./routes'),
      allowed = ('get,post,put,head,delete,trace,copy,lock,mkcol,move,' + 
                'purge,propfind,proppatch,unlock,report,mkactivity,' +
                'checkout,merge,m-search,notify,subscribe,unsubscribe,' +
                'patch,search,connect').split(',');

  // Set up route handlers
  Object.keys(routes).forEach(function(route) {
    var routeVerbs = Object.keys(routes[route]);

    // Catch all middleware for 401 and 405s
    app.all(route, security.authenticate, function(req, res, next) {
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

      res.set({
        'Allow':        allow,
        'Content-Type': 'application/json'
      });
      res.send(allow.split(','));
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
      var authorise = security.authorise[route] && security.authorise[route][verb];
      app[verb](route, authorise || security.youreGood, routes[route][verb]);
    });
  });

  // Close DB connection and exit cleanly on SIGINT
  process.on('SIGINT', function() { db.close(); });
  db.on('close', function() {
    console.log('Connection to API database closed');
    process.exit();
  });

  // Start API server
  var server = app.listen(process.env.PORT, function() {
    console.log('API server listening on %d', process.env.PORT);
  });
});
