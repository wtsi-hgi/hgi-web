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

Model = require 'models/base/model'

module.exports = class HomePage extends Model
  defaults:
    hero_title: 'Human Genetics Informatics',
    hero_subtitle: 'Project Administration',
    hero_text: 'Use these interfaces to enroll projects in HGI systems, control data access permissions, request analyses, monitor progress of analyses, and archive project results.',
    hero_link_href: '',
    hero_link_text: 'Enroll a project &raquo;'

