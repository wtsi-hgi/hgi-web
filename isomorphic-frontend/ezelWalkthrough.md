Execution path for the sample "commit viewer" Ezel application, plus
slight adaptations from when I was working out the plumbing!

# `./index.js`

Entry point

Principal imports:
* Express

* Environment variables (`./.env`)
* Setup (`./lib/setup`)
* Start Express server

## `./.env`

Project-wide environment variables

* Environment (e.g., dev, live, etc.)
* Server port
* API base URL

## `./lib/setup.js`

Exports function, taking Express instance as parameter

Principal imports:
* Express
* Backbone
* Sharify

* Set Sharify data from environment variables
  * API base URL
  * Environment
  * JS and CSS extensions (e.g., `.js` vs. `.min.js`)
* Override Backbone.sync with Backbone Super-Sync
* Mount Sharify Express app
* Environment-specific Express apps:
  * Development
    * Stylus
    * Browserify with Jade transform
  * Test
    * Stub API server (`./test/helpers/integration.js`)
* Mount main Express app (`./apps/commits`)
* Mount static assets from:
  * `./apps/[FOLDERS]/public`
  * `./components/[FOLDERS]/public`
  * `./vendor` (see note)
  * `./public`

n.b., The "vendor" static assets directory is something I've put in to
compartmentalise them. At this point, I'm not sure how correct it was to
do so. My uncertainty stemming from my understanding that using Ezel is
supposed to homogenise these things (e.g., there's no client dependency
on Backbone and there is already a server dependency on jQuery).
However, I can't see how they (jQuery and Bootstrap) could possibly work
without explicitly pushing them to the client.

On a related note, it seems very inelegant to me to have both client and
server-side copies of jQuery (i.e., `vendor/jquery` and
`node_modules/jquery/dist`, respectively). Maybe I should symlink the
client-side to the NPM module, but I'm not sure if that would break the
build process.

### `./apps/commits/index.js`

Exports Express app

Principal imports:
* Express

* Set app parameters:
  * `views        ./apps/commits/templates`
  * `view engine  jade`
* `GET /` defined in `./apps/commits/routes.js`

#### `./apps/commits/routes.js`

Export routing function

* Creates commits collection from `./collections/commits.js`
* On successful fetch:
  * Sets local sd.COMMITS to collection data
  * Renders index view with collection models data

##### `./collections/commits.js`

Exports Backbone collection of GitHub commits

Principal imports:
* Backbone
* Sharify data

* Sets collection model from `./models/commit.js`
* Sets collection URL to API base URL + `/repos/[OWNER]/[REPO]/commits`
* Initialises collection options `[OWNER]` and `[REPO]`

###### `./models/commit.js`

Exports Backbone model of GitHub commit

Principal imports:
* Backbone
* Sharify data

* Sets model URL to API base URL + `/repos/[OWNER]/[REPO]/[SHA]`

n.b., The `[OWNER]` and `[REPO]` values are passed down from the parent
collection; `[SHA]` is fetched from the API.

##### `./apps/commits/templates/index.jade`

Jade template for main page

n.b., Template links to files in `/assets`. These appear to be locally
stored in `./assets`, but I don't see how they're transformed and pushed
through to static representations on the server. I assume it's some
automagic done by Browserify.

* Mixins
* `./apps/commits/templates/list.jade`
* Sharify data to inline script
* `./assets/commits` (?) JavaScript and Stylus

###### `./assets/commits.js`

???

* Imports jQuery and executes with init member from
  `./apps/commits/client.js`

####### `./apps/commits/client.js`

Exports Backbone view for commits and an `init` function

Principal imports:
* Backbone
* jQuery
* Sharify data
* Commits collection

* Defines new view constructor with:
  * Initialisation function that renders the view on sync
  * Rendering function that passes the collection to the template
  * Event handling, to switch repo on search
* Initialisation
  * Sets view element to body (using jQuery)
  * Creates a commit collection as `collection`
