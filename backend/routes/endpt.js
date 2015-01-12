// HTTP End Point Interface for Express.js

// End Points should be defined as Express.js middleware functions, but
// for the sake of a self-describing API, should also have an '_options'
// member, which is consumed by the API server and pushed to the client
// when an OPTIONS request is made.

// AGPLv3 or later
// Copyright (c) 2015 Genome Research Limited

// For example:
// endpt(
//   function(req, res) {
//     res.type('html');
//     res.send('<p>Hello world!</p>');
//   },
//
//   {
//     description: 'A welcoming landing page'
//   }
// );

// The options object, if used, should be an arbitrary plain object
// (n.b., it will ultimately be served as JSON). While free, it should
// probably follow some kind of standard schema.

module.exports = function(fn, options) {
  if (typeof fn != 'function') {
    throw new TypeError('End point must be a function');
  }

  if (fn.length < 2) {
    throw new Error('End point function must have request and response parameters');
  }
  
  if (options) {
    if (typeof options != 'object' || options.constructor != Object) {
      throw new TypeError('End point options must be a plain object');
    }

    // Set end point options
    fn['_options'] = options;
  }

  return fn;
};
