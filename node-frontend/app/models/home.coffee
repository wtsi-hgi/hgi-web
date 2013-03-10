Model = require 'models/base/model'

module.exports = class Home extends Model
  defaults:
    hero_title: 'Human Genetics Informatics',
    hero_subtitle: 'Project Administration',
    hero_text: 'Use these interfaces to enroll projects in HGI systems, control data access permissions, request analyses, monitor progress of analyses, and archive project results.',
    hero_link_href: '',
    hero_link_text: 'Enroll a project &raquo;'

