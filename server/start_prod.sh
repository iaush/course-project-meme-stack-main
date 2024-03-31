#!/bin/bash

cd /server
yarn install
# We are serving the files without expecting changes now; hence serve 
# from server/public (where the react app is built) without nodemon
yarn serve