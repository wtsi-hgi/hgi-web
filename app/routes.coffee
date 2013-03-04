module.exports = (match) ->
  match '', 'home#index'
  match 'home', 'home#home', name: 'home'
  match 'about', 'home#about', name: 'about'
  match 'contact', 'home#contact', name: 'contact'
