Model = require 'models/base/model'

module.exports = class ContactPage extends Model
  defaults:
    title: 'Contact',
    text: 'Contact page text goes here.'
