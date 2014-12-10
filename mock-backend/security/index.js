// AGPLv3 or later
// Copyright (c) 2014 Genome Research Limited

module.exports = function(db) {
  return {
    authenticate: require('./authenticate'),
    authorise:    require('./authorise')(db),

    youreGood:    function(req, res, next) { next(); }
  };
};
