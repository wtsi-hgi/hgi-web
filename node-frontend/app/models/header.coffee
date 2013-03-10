Model = require 'models/base/model'

module.exports = class Header extends Model
  defaults:
    items: [
      {href: 'home', title: 'Home'},
      {href: 'about', title: 'About'},
      {href: 'contact', title: 'Contact'}
#      {href: 'http://mediawiki.internal.sanger.ac.uk/wiki/index.php/HGI', title: 'Wiki'}
    ]
