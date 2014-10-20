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
./start-container.sh
```

This will start the container on the Docker host forwarded to port 80.
If needed, set an alternative port as the command line option.
