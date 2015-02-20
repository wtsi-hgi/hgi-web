// Directory Enquiries Core Service API

// AGPLv3 or later
// Copyright (c) 2015 Genome Research Limited

require('node-env-file')(__dirname + '/.env');
var env = process.env;

// Logging
var logger = (function() {
  var bunyan = require('bunyan'),
      setup  = {
        name: 'hgi-web-core-ldap',
        streams: [{ level: 'info', stream: process.stderr }]
      };

  // Add a trace log, if required
  if (env.LOGFILE) {
    setup.streams.push({
      level: 'trace',
      path:  env.LOGFILE
    });
  }

  return bunyan.createLogger(setup);
})();

// Create LDAP client connection pool
var ldap = (function(clientOptions) {
  var ldap = require('ldapjs');

  // We don't want to log the bind credentials
  logger.info({
    host: clientOptions.url,
    pool: clientOptions.maxConnections
  }, 'Starting LDAP client');

  clientOptions.log = logger;
  return client = ldap.createClient(clientOptions);
})({
  url:             env.LDAPHOST, 
  bindDN:          env.BINDDN,
  bindCredentials: env.BINDPWD,
  maxConnections:  parseInt(env.POOLSIZE, 10) || 10
});

// Setup HTTP server
var express = require('express'),
    app     = express();

if (env.RPBASE) {
  app.set('trust proxy', true);
}

app.use(require('bunyan-middleware')({
  logger:         logger,
  obscureHeaders: ['Authorization']
}));

app.use(require('compression')());

// Profile hosting (if required)
if (env.PROFDIR) {
  var mustache = require('consolidate').mustache;

  var route = (env.PROFROUTE || '/profiles') + '/:id',
      tags  = {
        baseURL: env.RPBASE
      }

  app.engine('json', mustache);
  app.set('views', env.PROFDIR);
  app.set('view engine', 'json');

  app.get(route, function(req, res, next) {
    res.render(req.params.id, tags, function(err, output) {
      if (err) {
        // Some rendering error
        next({
          status:    500,
          message:   err.message,
          exception: err
        });

      } else {
        res.set('Content-Type', 'application/json');
        res.send(output);
      }
    });
  });
}

// API routing
require('./route.js')(app, ldap);

// Error handling
app.use(function(err, req, res, next) {
  if (err.exception) {
    req.log.error(err.exception);
  }

  res.set('Content-Type', 'application/json');
  res.status(err.status).send({
    status: err.status,
    error:  err.message
  });
});

// Let's go!
app.listen(env.PORT, function() {
  logger.info({
    port: env.PORT
  }, 'Service started');
});
