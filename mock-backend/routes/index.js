// AGPLv3 or later
// Copyright (c) 2014 Genome Research Limited

// HTTP methods must be in lowercase and be any of those supported by
// Express, with the exception of 'options'

var client = require('./client');

module.exports = {
  '/': {
    get: function(req, res) {
      res.type('json');
      res.send('"Hello world!"');
    }
  },

  '/_xyzzy': {
    get: function(req, res) {
      res.status(418).send('I\'m a teapot');
    }
  },

  '/_client':         client.root,
  '/_client/:id':     client.id,
  '/_client/:id/:fn': client.fn
};
