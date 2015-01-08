# Human Genetics Informatics Project Interface

Now with Isomorphic JavaScript goodness!

## Quick Start

```sh
cd hgi-web/isomorphic-frontend
npm install
make up
```

This starts the application on `localhost:9000` in development mode. For
production, the [environment variables](.env) file needs to be updated
appropriately and minified assets built (`make assets`).

### Containerisation with Docker

From the project root:

```sh
docker build -t frontend .
./boot.sh
```

This will start the frontend behind a reverse proxy in the container,
through port 80 by default. If the app needs to run from a non-root
location, then the base path can be added as an [environment
variable](.env) using the `BASE_PATH` key (e.g., `BASE_PATH=/app`).
