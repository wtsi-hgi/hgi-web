// AGPLv3 or later
// Copyright (c) 2014 Genome Research Limited

// HTTP methods must be in lowercase and be any of those supported by
// Express, with the exception of 'options'

var endpt  = require('./endpt'),
    client = require('./client');

module.exports = {
  '/': {
    get: endpt(function(req, res) {
      res.type('json');
      res.send('"Hello world!"');
    }, {
      description: 'Landing page placeholder'
    })
  },

  '/_xyzzy': {
    get: endpt(function(req, res) {
      res.status(418).send('I\'m a teapot');
    }, {
      description: 'HTTP Easter egg'
    })
  },

  '/_client':                 client.root,
  '/_client/:id':             client.id,
  '/_client/:id/:coll/:doc?': client.data
};
