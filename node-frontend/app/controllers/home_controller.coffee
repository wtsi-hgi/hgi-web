Controller = require 'controllers/base/controller'
mediator = require 'mediator'

HomePage = require 'models/home_page'
HomePageView = require 'views/home_page_view'

module.exports = class HomeController extends Controller
  historyURL: 'home'

  index: ->
    mediator.publish '!router:changeURL', 'home'

  home: ->
    @model = new HomePage()
    @view = new HomePageView({@model})
