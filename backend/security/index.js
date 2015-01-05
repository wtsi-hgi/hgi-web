// AGPLv3 or later
// Copyright (c) 2014 Genome Research Limited

module.exports = {
  authenticate: require('./authenticate'),
  authorise:    require('./authorise'),

  youreGood:    function(req, res, next) { next(); }
};
