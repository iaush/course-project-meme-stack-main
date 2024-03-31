#!/bin/bash

cd /server
yarn install
node ./seedMongoDb.js
yarn start