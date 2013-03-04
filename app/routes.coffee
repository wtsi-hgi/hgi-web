module.exports = (match) ->
  match '', 'home#index'
  match 'home', 'home#home', name: 'home'
  match 'about', 'about#about', name: 'about'
  match 'contact', 'contact#contact', name: 'contact'
