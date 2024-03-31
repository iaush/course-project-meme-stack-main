#!/bin/sh

printg() {
  printf "\e[32m$1\e[m\n"
}

# Change localhost to server for package.json
printg "Patching package.json file for building image..."
sed -iE "s/localhost:3001/server:3001/g" ./client/package.json

# Start all of the services for development
printg "Starting up docker compose..."
docker-compose -f docker-compose.dev.yml up

# cleanup
printg "Starting cleanup..."
sed -iE "s/server:3001/localhost:3001/g" ./client/package.json
rm ./client/package.jsonE

printg "Docker down and cleanup completed. Exiting"