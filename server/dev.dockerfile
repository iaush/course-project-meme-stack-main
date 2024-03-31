FROM node:19-alpine

WORKDIR /server

RUN apk add git

COPY package.json .
RUN corepack enable  \
    && corepack prepare yarn@stable --activate

COPY yarn.lock ./
RUN yarn set version 3.3.1
RUN yarn install
RUN yarn rebuild bcrypt

COPY . .
RUN chmod +x /server/start_dev.sh

CMD yarn start
EXPOSE 3001