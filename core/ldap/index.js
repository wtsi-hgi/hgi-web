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
var ldap = (function(url, poolSize) {
  var ldap = require('ldapjs');
  
  logger.info({
    url:      url,
    poolSize: poolSize
  }, 'Starting LDAP client');

  return ldap.createClient({
    url:            url,
    maxConnections: poolSize,
    log:            logger
  });
})(env.LDAPHOST, parseInt(env.POOLSIZE || 5, 10));

// Setup HTTP server
var express = require('express'),
    app     = express();

app.use(require('bunyan-middleware')({
  logger:         logger,
  obscureHeaders: ['Authorization']
}));

// API routing
require('./route.js')(app, ldap);

// Let's go!
app.listen(env.PORT, function() {
  logger.info({
    port: env.PORT
  }, 'Service started');
});
