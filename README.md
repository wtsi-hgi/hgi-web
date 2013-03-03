# Brunch with Chaplin and Initializr
![](https://a248.e.akamai.net/camo.github.com/b7ebb8bbcec7938940cf8e9c441124c3bddafd3a/687474703a2f2f662e636c2e6c792f6974656d732f34373039326b30423141334a317a3166306b34362f6277632e706e67)

Brunch with Chaplin and Initializr is a skeleton (boilerplate) for [Brunch](http://brunch.io)
based on [Chaplin](https://github.com/chaplinjs/chaplin) framework
and [Initializr](http://www.initializr.com/).

It is a fork of [Brunch with Chaplin](https://github.com/paulmillr/brunch-with-chaplin)
extended by [Initializr](http://www.initializr.com/) to include [Twitter Bootstrap](http://twitter.github.com/bootstrap/)
and [HTML5 Boilerplate](http://html5boilerplate.com/).

See those projects for more information.

For an alternate approach to add HTML5 Boilerplate and Twitter Bootstrap, see [Brunch with Chaplin and Bootstrap](https://github.com/vip32/brunch-with-chaplin-and-bootstrap).
The primary difference between this project and that one is this project includes the individual
bootstrap LESS style files and javascript plugin files so you can modify or omit ones you don't want.
[Brunch with Chaplin and Bootstrap](https://github.com/vip32/brunch-with-chaplin-and-bootstrap) includes only the
compiled/merged versions of those files.

Requires Brunch 1.3+.

Note: there is a problem running `brunch test` when package.json contains less-brunch in Brunch 1.3.0.
The problem appears to have been fixed in Brunch 1.4.0-pre.

## Getting started
* Create new project via executing `brunch new <project name> --s git://github.com/DallanQ/brunch-with-chaplin-and-initializr.git`
* Build the project with `brunch b` or `brunch w`.
* Open the `public/` dir to see the result.
* Write your code.

See [Chaplin github page](https://github.com/chaplinjs/chaplin) for
documentation.

## Example app using this skeleton

[Here is a fork of the brunch Todos app](https://github.com/DallanQ/todos) that uses this skeleton.

If you want to learn how to use the brunch-with-chaplin framework, [Ost.io](https://github.com/paulmillr/ostio)
and this Todos app fork are good places to begin. Just be aware that the ToDos app fork is my first effort with
brunch-with-chaplin, so it's probably not optimal.

## Integrating Initializr

Here's what was done to integrate Initializr

Generate Initializr with
* Responsive bootstrap
* Modernizr
* LESS
* chrome frame
* IE Classes
* Favicon

Remove files in the brunch-with-chaplin project that are no longer needed
* `rm vendor/styles/normalize.css`

Rename the images directory to img so the image references work in the bootstrap style files
* `mv app/assets/images app/assets/img`

Copy files; remove the pre-compiled bootstrap javascript files
* `cp ../initializr/favicon.ico app/assets`
* `cp ../initializr/img/* app/assets/img`
* `cp -r ../initializr/less/* vendor/styles`
* `cp -r ../initializr/js/libs/bootstrap vendor/scripts`
* `rm vendor/scripts/bootstrap/bootstrap.*`

Copy the development version of modernizr from modernizr.com; Initializr includes only the minified version
* `curl http://modernizr.com/downloads/modernizr-2.5.3.js > vendor/scripts/modernizr-2.5.3.js`

Edit config.coffee
* add modernizr and bootstrap plugins to files.javascripts.order.before
* replace normalize.css with style.less in files.stylesheets.order.before
* set paths.ignored to vendor/styles/bootstrap

Edit index.html
* replace body content with body content from initializr/index.html, minus the script tags at the bottom

Edit package.json
* add less-brunch
* add jsdom to devDependencies for `brunch test`

## Other
Versions of software the skeleton uses:

* HTML5Boilerplate 3.0.3
* Twitter bootstrap 2.0.4
* Modernizr 2.5.3
* jQuery 1.7.2
* Backbone 0.9.2
* Underscore 1.3.3
* Chaplin [2dc3b2](https://github.com/moviepilot/chaplin/commit/2dc3b2e2d0eb95678367aad3e2af0f16c889bac7)

## License
The MIT license.

Copyright (c) 2012 Dallan Quass (http://github.com/DallanQ)

Copyright (c) 2012 Paul Miller (http://paulmillr.com/)

Copyright (c) 2012 Moviepilot GmbH, 9elements GmbH et al.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
