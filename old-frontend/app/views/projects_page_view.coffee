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

template = require 'views/templates/projects_page'
PageView = require 'views/base/page_view'
ProjectsCollection = require 'models/projects_collection'
ProjectsCollectionView = require 'views/projects_collection_view'


module.exports = class ProjectsPageView extends PageView
  template: template
  className: 'projects-page'
  id: 'projects-page'
  container: '#main-container'
  autoRender: true

  initialize: ->
    super
    @subscribeEvent 'loginStatus', @render
    @subscribeEvent 'startupController', @render

  render: ->
    console.log 'ProjectsPageView render()'
    super

  renderSubviews: ->
    console.log 'ProjectsPageView renderSubviews()'
    @subview 'projects', new ProjectsCollectionView
      collection: @collection
      container: '#projects-container'
    @subview('projects').render()

  attach: ->
    super
    @renderSubviews()



