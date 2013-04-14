Collection = require 'models/base/collection'
Project = require 'models/project'

module.exports = class Projects extends Collection
    model: Project
    url: "http://localhost:4444/projects"
    
 