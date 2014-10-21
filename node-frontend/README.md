# Human Genetics Informatics Project Interface

## Quick Start

```sh
cd hgi-web/node-frontend
npm install
brunch watch --server --port 9000
```

Alternatively, build and run the Docker container.

## Containerisation with Docker

From the project root:

```sh
docker build -t frontend .
./boot.sh
```

This will start the frontend behind a reverse proxy in the container,
through port 80. (Use the command line argument to set an alternative
port, if necessary.)
