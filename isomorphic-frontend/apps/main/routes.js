// Server-side routes for main pages
exports.home     = function(req, res, next) { res.render('home'); };
exports.projects = function(req, res, next) { res.render('projects'); };
exports.about    = function(req, res, next) { res.render('about'); };
exports.contact  = function(req, res, next) { res.render('contact'); };
