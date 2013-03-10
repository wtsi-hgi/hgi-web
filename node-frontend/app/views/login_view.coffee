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

mediator = require 'mediator'
utils = require 'lib/utils'
View = require 'views/base/view'
template = require 'views/templates/login'

module.exports = class LoginView extends View
  template: template
  id: 'login'
  container: '#content-container'
  autoRender: true

  # Expects the serviceProviders in the options
  initialize: (options) ->
    super
    @initButtons options.serviceProviders

  # In this project we currently only have one service provider and therefore
  # one button. But this should allow for different service providers.
  initButtons: (serviceProviders) ->
    for serviceProviderName, serviceProvider of serviceProviders

      buttonSelector = ".#{serviceProviderName}"
      @$(buttonSelector).addClass('service-loading')

      loginHandler = _(@loginWith).bind(
        this, serviceProviderName, serviceProvider
      )
      @delegate 'click', buttonSelector, loginHandler

      loaded = _(@serviceProviderLoaded).bind(
        this, serviceProviderName, serviceProvider
      )
      serviceProvider.done loaded

      failed = _(@serviceProviderFailed).bind(
        this, serviceProviderName, serviceProvider
      )
      serviceProvider.fail failed

  loginWith: (serviceProviderName, serviceProvider, e) ->
    e.preventDefault()
    return unless serviceProvider.isLoaded()
    mediator.publish 'login:pickService', serviceProviderName
    mediator.publish '!login', serviceProviderName

  serviceProviderLoaded: (serviceProviderName) ->
    @$(".#{serviceProviderName}").removeClass('service-loading')

  serviceProviderFailed: (serviceProviderName) ->
    @$(".#{serviceProviderName}")
      .removeClass('service-loading')
      .addClass('service-unavailable')
      .attr('disabled', true)
      .attr('title', "Error connecting. Please check whether you are
blocking #{utils.upcase(serviceProviderName)}.")
