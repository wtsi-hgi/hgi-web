template = require 'views/templates/contact'
PageView = require 'views/base/page_view'

module.exports = class ContactPageView extends PageView
  template: template
  className: 'contact-page'
  id: 'contact-page'
  container: '#main-container'
  autoRender: true

  initialize: ->
    super
    @subscribeEvent 'loginStatus', @render
    @subscribeEvent 'startupController', @render
