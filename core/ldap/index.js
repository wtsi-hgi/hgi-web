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

app.use(require('bunyan-middleware')({
  logger:         logger,
  obscureHeaders: ['Authorization']
}));

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
