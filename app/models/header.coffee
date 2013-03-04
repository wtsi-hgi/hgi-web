Model = require 'models/base/model'

module.exports = class Header extends Model
  defaults:
    logo_html: '<object width="60" height="30" title="HGI logo" data="../img/HGI-ltblue.svg" type="image/svg+xml"><img alt="HgI" src="../img/HGI-ltblue.60x30.png"/></object>',
    items: [
      {href: 'home', title: 'Home'},
      {href: 'about', title: 'About'},
      {href: 'contact', title: 'Contact'}
#      {href: 'http://mediawiki.internal.sanger.ac.uk/wiki/index.php/HGI', title: 'Wiki'}
    ]
