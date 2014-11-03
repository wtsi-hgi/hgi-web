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

Collection = require 'models/base/collection'
Project = require 'models/project'
Chaplin = require 'chaplin'
Settings = require 'settings'

module.exports = class ProjectsCollection extends Collection

  model: Project

  initialize: ->
    super

    _(this).extend Chaplin.SyncMachine

    @syncStateChange @announce

  fetch: ->
    @beginSync()
    @options = {}
    @options.success = (collection, response, options) =>
      success? collection, response
      @finishSync()
    @options.error = (collection, xhr, options) =>
      console.log 'ProjectsCollection fetch error'
      console.log xhr
    super @options

  url: ->
    console.log 'ProjectsCollection setting URL'
    console.log Settings.projectRestUrl
    Settings.projectRestUrl

  parse: (response) ->
    response.Project

  announce: ->
    console.debug 'ProjectsCollection: state changed to ' + @syncState()

