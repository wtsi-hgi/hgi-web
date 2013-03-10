template = require 'views/templates/about'
PageView = require 'views/base/page_view'

module.exports = class AboutPageView extends PageView
  template: template
  className: 'about-page'
  id: 'about-page'
  container: '#main-container'
  autoRender: true

  initialize: ->
    super
    @subscribeEvent 'loginStatus', @render
    @subscribeEvent 'startupController', @render
