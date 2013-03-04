Controller = require 'controllers/base/controller'
mediator = require 'mediator'

HomePage = require 'models/home_page'
HomePageView = require 'views/home_page_view'

AboutPage = require 'models/about_page'
AboutPageView = require 'views/about_page_view'

ContactPage = require 'models/contact_page'
ContactPageView = require 'views/contact_page_view'

module.exports = class HomeController extends Controller
  historyURL: 'home'

  index: ->
    mediator.publish '!router:route', '/home'

  home: ->
    @model = new HomePage()
    @view = new HomePageView({@model})

  about: ->
    @model = new AboutPage()
    @view = new AboutPageView({@model})

  contact: ->
    @model = new ContactPage()
    @view = new ContactPageView({@model})
