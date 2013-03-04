Model = require 'models/base/model'

module.exports = class Footer extends Model
  defaults:
    copyrightholder: 'Genome Research Limited',
    copyrightyears: '2013'
