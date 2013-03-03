exports.config =
  # See http://brunch.readthedocs.org/en/latest/config.html for documentation.
  files:
    javascripts:
      defaultExtension: 'coffee'
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^vendor/
        'test/javascripts/test.js': /^test(\/|\\)(?!vendor)/
        'test/javascripts/test-vendor.js': /^test(\/|\\)(?=vendor)/
      order:
        before: [
          'vendor/scripts/console-helper.js',
          'vendor/scripts/jquery-1.7.2.js',
          'vendor/scripts/underscore-1.3.3.js',
          'vendor/scripts/backbone-0.9.2.js',
          'vendor/scripts/modernizr-2.5.3.js',
          'vendor/scripts/bootstrap/transition.js',
          'vendor/scripts/bootstrap/alert.js',
          'vendor/scripts/bootstrap/button.js',
          'vendor/scripts/bootstrap/carousel.js',
          'vendor/scripts/bootstrap/collapse.js',
          'vendor/scripts/bootstrap/dropdown.js',
          'vendor/scripts/bootstrap/modal.js',
          'vendor/scripts/bootstrap/tooltip.js',
          'vendor/scripts/bootstrap/popover.js',
          'vendor/scripts/bootstrap/scrollspy.js',
          'vendor/scripts/bootstrap/tab.js',
          'vendor/scripts/bootstrap/typeahed.js'
        ]

    stylesheets:
      defaultExtension: 'styl'
      joinTo:
        'stylesheets/app.css': /^(app|vendor)/
        'test/stylesheets/test.css': /^test/
      order:
        before: ['vendor/styles/style.less']
        after: ['vendor/styles/helpers.css']

    templates:
      defaultExtension: 'hbs'
      joinTo: 'javascripts/app.js'

  paths:
    ignored: /^vendor(\/|\\)styles(\/|\\)bootstrap/

  framework: 'chaplin'
