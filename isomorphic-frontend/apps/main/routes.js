// Server-side routes for main pages
['home', 'projects', 'about', 'contact'].forEach(function(page) {
  exports[page] = function(req, res, next) {
    var locals = {baseURL: req.headers['x-script-name'] || ''};
    res.render(page, locals);
  }
});
