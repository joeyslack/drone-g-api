# gather-api

Feel free to contribute. Private until license.

## Description

Gather.ai API REST service.

Should provide a fully qualified REST solution for client, global and possibly external web requests. Batteries included framework, running against `postgres`, [Nest](https://github.com/nestjs/nest) and possibly some `azure` services.

Environment configuration required. Ask your local nerd.

## Prerequisits

YOU MUST HAVE A `.env` file to run this project!! It MUST look like this:

```
DATABASE_PATH=YOUR_SYSTEM_USERNAME:@localhost:5432
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=YOUR_SYSTEM_USERNAME
DATABASE=gather
DATABASE_PASSWORD=
```

(unsorted stuff)
- Helm
- azcopy + azcopy login
- kube ctl (az kube resources)

### Mac/linux specific prereq

You will need: latest TLS of node: `npm install latest` or `brew install node` or whatever you like.

You will need a locally running postgresql db, and created db. `brew install postgres` and something like `psql -c 'create database gather;' -U root`. Ask for help if needed.

If you want to run production-like containers: [Docker](https://www.docker.com/)

Kubernetes Orchestration: [Minikube](https://github.com/kubernetes/minikube) if you want to run k8s locally. For the most part you probably won't unless devops.

### Other Prerequisits

Contribute for other platforms... 

## Installation

```bash
# install and migrate
$ npm install
$ npm run migration
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running app with docker

```bash
# build
$ npm run docker:build

# start
$ npm run docker:start

```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Misc

### Mission Report

GET `/missions/:directory/`
POST `/missions/:directory/`

GET `/missions/:directory/items`
POST `/missions/:directory/items`

GET `/missions/:directory/items/:inventoryItemId`
POST `/missions/:directory/items/:inventoryItemId`

### Verification API

GET `/warehouse/inventory/validate/:inventoryItemId`
POST `/warehouse/inventory/validate/:inventoryItemId`

## License

TBD... 