# API Server

(Write something inspirational here...)

## Installation

The server should be run as an upstream application. Don't forget to
`npm install` to fetch the required dependencies.

The [`.env`](.env) file is used to manage configuration, via environment
variables:

* `PORT` Port for the API server to listen on
* `KEYFILE` The private key used to authenticate the token
* `DB_SOURCE` The main API MongoDB database URL
