// Directory Enquiries Core Service API

// AGPLv3 or later
// Copyright (c) 2015 Genome Research Limited

require('node-env-file')(__dirname + '/.env');
var env = process.env;

// Logging
var bunyan = require('bunyan'),
    logger = bunyan.createLogger({
      name:    'hgi-web-core-ldap',
      streams: [
        { level: 'info',  stream: process.stderr },
        { level: 'trace', path:   env.LOGFILE || 'ldap.log' }
      ]
    });

// Create LDAP client connection pool
var ldap = (function(clientOptions) {
  var ldap = require('ldapjs');

  // We don't want to log the bind credentials
  logger.info({
    host: clientOptions.url,
    pool: clientOptions.maxConnections
  }, 'Starting LDAP client');

  clientOptions.log = logger;
  var client = ldap.createClient(clientOptions);

  // Export relevant LDAP errors with client
  // This is a bit messy :P
  client.error = {};
  ['LDAPError', 'NoSuchObjectError'].forEach(function(e) {
    client.error[e] = ldap[e];
  });

  return client;

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

// TODO Error handling
// app.use(function(err, req, res, next) {
//   req.log.error(err);
//   res.status(500).send(err.message);
// });

// Let's go!
app.listen(env.PORT, function() {
  logger.info({
    port: env.PORT
  }, 'Service started');
});
