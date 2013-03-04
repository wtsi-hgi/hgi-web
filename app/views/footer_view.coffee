mediator = require 'mediator'
View = require 'views/base/view'
template = require 'views/templates/footer'

module.exports = class FooterView extends View
  template: template
  id: 'footer'
  className: 'footer'
  container: '#footer-container'
  autoRender: true

  initialize: ->
    super
    @subscribeEvent 'loginStatus', @render
    @subscribeEvent 'startupController', @render
