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

Chaplin = require 'chaplin'
mediator = require 'mediator'
routes = require 'routes'
SessionController = require 'controllers/session_controller'
HeaderController = require 'controllers/header_controller'
FooterController = require 'controllers/footer_controller'
Layout = require 'views/layout'
Settings = require 'settings'

# The application object
module.exports = class HGIApplication extends Chaplin.Application
  # Set your application name here so the document title is set to
  # “Controller title – Site title” (see Layout#adjustTitle)
  title: Settings.title

  initialize: ->
    # No need to call super as Chaplin.Application.initialize is a no-op

    # Initialize core components
    @initDispatcher()
    @initLayout()
    @initMediator()

    # Application-specific scaffold
    @initControllers()

    # Register all routes and start routing
    @initRouter routes, root: Settings.baseUrl
    # You might pass Router/History options as the second parameter.
    # Chaplin enables pushState per default and Backbone uses / as
    # the root per default. You might change that in the options
    # if necessary:
    # @initRouter routes, pushState: false, root: '/subdir/'

    # Freeze the application instance to prevent further changes
    Object.freeze? this

    # Connect to window for debugging
    window.Application = this

  # Override standard layout initializer
  # ------------------------------------
  initLayout: ->
    # Use an application-specific Layout class. Currently this adds
    # no features to the standard Chaplin Layout, it’s an empty placeholder.
    @layout = new Layout {@title}

  # Instantiate common controllers
  # ------------------------------
  initControllers: ->
    # These controllers are active during the whole application runtime.
    # You don’t need to instantiate all controllers here, only special
    # controllers which do not to respond to routes. They may govern models
    # and views which are needed the whole time, for example header, footer
    # or navigation views.
    # e.g. new NavigationController()
    new SessionController()
    new HeaderController()
    new FooterController()

  # Create additional mediator properties
  # -------------------------------------
  initMediator: ->
    # Create a user property
    Chaplin.mediator.user = null
    # Add additional application-specific properties and methods
    # Seal the mediator
    Chaplin.mediator.seal()
