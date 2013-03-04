Controller = require 'controllers/base/controller'
mediator = require 'mediator'

AboutPage = require 'models/about_page'
AboutPageView = require 'views/about_page_view'

module.exports = class AboutController extends Controller
  historyURL: 'about'

  about: ->
    @model = new AboutPage()
    @view = new AboutPageView({@model})
