Model = require 'models/base/model'

module.exports = class AboutPage extends Model
  defaults:
    title: 'About',
    text: 'About page text goes here.'
