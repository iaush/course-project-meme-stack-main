FROM node:19-alpine

WORKDIR /client

RUN apk add git

COPY package.json .
COPY . .
RUN corepack enable && corepack prepare yarn@stable --activate && yarn set version 3.3.1 && yarn install
RUN sed -i 's/localhost/server/g' package.json

CMD yarn start
EXPOSE 3000