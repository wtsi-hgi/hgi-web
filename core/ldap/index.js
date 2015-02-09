// Directory Enquiries Core Service API

// AGPLv3 or later
// Copyright (c) 2015 Genome Research Limited

require('node-env-file')(__dirname + '/.env');
var env = process.env;

// Logging
var bunyan = require('bunyan'),
    logger = bunyan.createLogger({
      name:   'hgi-web-core-ldap',
      stream: process.stderr,
      level:  'trace'
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

