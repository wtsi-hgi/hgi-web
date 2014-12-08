// AGPLv3 or later
// Copyright (c) 2014 Genome Research Limited

// HTTP methods must be in lowercase and be any of those supported by
// Express, with the exception of 'options'

module.exports = {
  '/': {
    get: function(req, res) {
      res.type('json');
      res.send('"Hello world!"');
    }
  },

  '/foo': {
    post: function(req, res) {
      res.send();
    }
  }
};
