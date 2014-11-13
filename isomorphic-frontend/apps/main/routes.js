// Server-side routes for main pages
exports.home    = function(req, res, next) { res.render('home'); };
exports.about   = function(req, res, next) { res.render('about'); };
exports.contact = function(req, res, next) { res.render('contact'); };
