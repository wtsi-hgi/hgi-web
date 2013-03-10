template = require 'views/templates/home'
PageView = require 'views/base/page_view'

module.exports = class HomePageView extends PageView
  template: template
  className: 'home-page'
  id: 'home-page'
  container: '#main-container'
  autoRender: true

  initialize: ->
    super
    @subscribeEvent 'loginStatus', @render
    @subscribeEvent 'startupController', @render
