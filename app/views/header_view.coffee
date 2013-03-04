mediator = require 'mediator'
View = require 'views/base/view'
template = require 'views/templates/header'

module.exports = class HeaderView extends View
  template: template
  id: 'header'
  className: 'header'
  container: '#header-container'
  autoRender: true

  initialize: ->
    super
    @subscribeEvent 'loginStatus', @render
    @subscribeEvent 'startupController', @startupURL
#    @subscribeEvent '!router:changeURL', @setActiveNavigation

  startupURL: (controller) ->
    @setActiveNavigation controller.params.path

  setActiveNavigation: (path) ->
    console.log path
    @$(".nav li > a").parent().removeClass "active"
    @$(".nav li > a[href=\"" + path + "\"]").parent().addClass "active"

