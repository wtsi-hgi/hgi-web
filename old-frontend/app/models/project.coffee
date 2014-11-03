Model = require 'models/base/model'

module.exports = class Project extends Model
  defaults: 
    dbid: ""
    id: ""
    team: ""
    name: ""
  
