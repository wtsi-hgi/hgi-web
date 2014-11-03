// Sets up intial project settings, middleware, mounted apps, and
// global configuration such as overriding Backbone.sync and
// populating sharify data

var express  = require('express'),
    Backbone = require('backbone'),
    sharify  = require('sharify'),
    path     = require('path'),
    fs       = require('fs');

module.exports = function(app) {
  // Inject some configuration & constant data into sharify
  var sd = sharify.data = {
    API_URL:  process.env.API_URL,
    NODE_ENV: process.env.NODE_ENV,
    JS_EXT:   'production' == process.env.NODE_ENV ? '.min.js'  : '.js',
    CSS_EXT:  'production' == process.env.NODE_ENV ? '.min.css' : '.css'
  };

  // Override Backbone to use server-side sync
  Backbone.sync = require('backbone-super-sync');

  // TODO ch12 20141103 Use this function to inject specific HTTP
  // headers into *every* request. This may be useful for, e.g., OAUTH
  Backbone.sync.editRequest = function(req, method, model, options) {
    req.set({'User-Agent': 'wtsi-hgi'});
  };

  // Mount sharify
  app.use(sharify);

  // Development only
  if ('development' == sd.NODE_ENV) {
    // Compile assets on request in development
    app.use(require('stylus').middleware({
      src:  path.resolve(__dirname, '../'),
      dest: path.resolve(__dirname, '../public')
    }));

    app.use(require('browserify-dev-middleware')({
      src:        path.resolve(__dirname, '../'),
      transforms: [require('jadeify')]
    }));
  }

  // Test only
  if('test' == sd.NODE_ENV) {
    // Mount fake API server
    app.use('/__api', require('../test/helpers/integration.js').api);
  }

  // Mount apps
  app.use(require('../apps/commits'));

  // Mount static middleware for sub apps, components, and project-wide
  fs.readdirSync(path.resolve(__dirname, '../apps')).forEach(function(fld) {
    app.use(express.static(path.resolve(__dirname, '../apps/' + fld + '/public')));
  });

  fs.readdirSync(path.resolve(__dirname, '../components')).forEach(function(fld) {
    app.use(express.static(path.resolve(__dirname, '../components/' + fld + '/public')));
  });
  
  app.use(express.static(path.resolve(__dirname, '../public')));
}
