Controller = require 'controllers/base/controller'
mediator = require 'mediator'

ContactPage = require 'models/contact_page'
ContactPageView = require 'views/contact_page_view'

module.exports = class ContactController extends Controller
  historyURL: 'contact'

  contact: ->
    @model = new ContactPage()
    @view = new ContactPageView({@model})
