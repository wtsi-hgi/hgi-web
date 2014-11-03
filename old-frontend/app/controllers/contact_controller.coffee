#    This file is part of hgi-web.
#
#    hgi-web is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    hgi-web is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with hgi-web.  If not, see <http://www.gnu.org/licenses/>.

Controller = require 'controllers/base/controller'
mediator = require 'mediator'

ContactPage = require 'models/contact_page'
ContactPageView = require 'views/contact_page_view'

module.exports = class ContactController extends Controller
  historyURL: 'contact'

  contact: ->
    @model = new ContactPage()
    @view = new ContactPageView({@model})
