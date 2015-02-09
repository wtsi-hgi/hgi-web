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
        { stream: process.stderr,            level: 'info' },
        { path:   env.LOGFILE || 'ldap.log', level: 'trace' }
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

var middleware = {
  bunyan: require('bunyan-middleware')
};

app.use(middleware.bunyan({
  logger:         logger,
  obscureHeaders: ['Authorization']
}));

// API routing
// TODO

// Let's go!
app.listen(env.PORT, function() {
  logger.info({
    port: env.PORT
  }, 'Service started');
});
// ldap.search(env.BASEDN, {
//   filter:     '(uid=ch12)',
//   attributes: ['cn', 'mail'],
//   scope:      'sub'
// }, function(err, ldapRes) {
//   ldapRes.on('searchEntry', function(entry) {
//     console.log(entry.object.cn, entry.object.mail);
//   });
// });
