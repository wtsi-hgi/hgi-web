// AGPLv3 or later
// Copyright (c) 2014 Genome Research Limited

module.exports = function(req, res, next) {
  // Vacuous authentication, for now
  next();

  // Not cool
  // res.status(401).send('Unauthorised');
};
