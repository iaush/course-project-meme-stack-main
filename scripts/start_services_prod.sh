#!/bin/sh

printg() {
  printf "\e[32m$1\e[m\n"
}

# Build react app and docs to server folder
cd ./client
yarn build
yarn build-storybook-server
cd ..

# Start mongodb and express
printg "Starting up docker compose..."
docker-compose -f docker-compose.prod.yml up --force-recreate --build

printg "Docker down and cleanup completed. Exiting"