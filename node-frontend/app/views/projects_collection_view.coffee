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

CollectionView = require 'views/base/collection_view'
ProjectView = require 'views/project_view'

module.exports = class ProjectsCollectionView extends CollectionView
  tagName: 'ul'
  id: 'projects-list'
  className: 'list'
  itemView: ProjectView
  autoRender: false
  rendered: no

  render: ->
    console.log 'ProjectsCollectionView render()'
    super

  initialize: ->
    super
    console.log 'ProjectsCollectionView initialize()'

    @collection.syncStateChange =>
      console.log 'ProjectsCollectionView: @collection.syncStateChange'
      console.log this

    @collection.synced =>
      console.log 'ProjectsCollectionView: @collection.synced'
      unless @rendered
        @render()
	@rendered = yes

