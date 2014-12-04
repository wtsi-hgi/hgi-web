// AGPLv3 or later
// Copyright (c) 2014 Genome Research Limited

var Backbone   = require('backbone'),
    $ = jQuery = require('jquery'),
    bootstrap  = require('bootstrap'),
    sd         = require('sharify').data;

// Let's get the jQuery dependencies sorted
Backbone.$ = $;

// Content templates
// Call with arguments for templating locals
// NOTE These have to be hardcoded for Jade to process them at build
// time. We can't create them dynamically at runtime, unfortunately :P
var getContent = {
  home:     require('./templates/homeContent.jade'),
  projects: require('./templates/projectsContent.jade'),
  about:    require('./templates/aboutContent.jade'),
  contact:  require('./templates/contactContent.jade')
};

module.exports.UIView = UIView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change', this.render, this);
  },

  render: function() {
    var old    = this.model.previous('active');
        active = this.model.get('active'),
        newID  = active.data('id');

    // Only refresh if needs be
    // (The change event is a little trigger-happy onload)
    if (newID != old.data('id')) {
      // Switch activated navlink
      old.removeClass('active');
      active.addClass('active');

      // Update contents
      this.$el.html(getContent[newID]);
    }
    
    return this;
  }
});

// Client-side routes
module.exports.ClientRouter = ClientRouter = Backbone.Router.extend({
  routes: {'*id(/)': 'mainPage'}
});

// Client
module.exports.init = function() {
  // We use this to strip the base path prefix from routes
  var prefixStrip = (function() {
    var base  = sd.BASE_PATH.slice(1), // We don't want the initial '/'
        strip = new RegExp('^' + base + '/?');

    return function(s) { return (s || '').replace(strip, ''); };
  })();
  
  var navLinks = {
    home:     $('li.nav-link[data-id="home"]'),
    projects: $('li.nav-link[data-id="projects"]'),
    about:    $('li.nav-link[data-id="about"]'),
    contact:  $('li.nav-link[data-id="contact"]')
  };

  var ui = new UIView({
    el:    $('#content'),
    model: new Backbone.Model({active: $('li.nav-link.active')})
  });

  var router = new ClientRouter;

  router.on('route:mainPage', function(id) {
    var route = prefixStrip(id),
        activeLink = navLinks[route] || navLinks.home;

    ui.model.set('active', activeLink);
  });

  Backbone.history.start({pushState: true});

  // Intercept link click event handler to disable internal links being
  // routed by Express and instead routed by Backbone. This gives us a
  // nice SPA, but also allows us to go direct to specific URLs and then
  // server-side Backbone will render the appropriate view, pushing it
  // to the client. We can disable this behaviour by giving the links a
  // 'data-bypass' attribute.
  // See: http://stackoverflow.com/a/12082118/876937
  $(document).on('click', 'a:not([data-bypass])', function(e) {
    var href = {prop: $(this).prop('href'), attr: $(this).attr('href')};
    var root = location.protocol + '//' + location.host + Backbone.history.options.root;

    if (href.prop && href.prop.slice(0, root.length) === root) {
      e.preventDefault();
      Backbone.history.navigate(href.attr, true);
    }
  });
};
