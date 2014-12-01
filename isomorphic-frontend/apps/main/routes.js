// Server-side routes for main pages
['home', 'projects', 'about', 'contact'].forEach(function(page) {
  exports[page] = function(req, res, next) {
    res.render(page);
  }
});
