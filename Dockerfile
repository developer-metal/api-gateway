FROM node:18.18.0-alpine3.18

RUN apk upgrade libssl3 libcrypto3 --no-cache

RUN apk update && apk upgrade --no-cache

RUN mkdir /backend

WORKDIR /backend

ADD . /backend

RUN npm install -g npm@10.6.0

RUN npm install

RUN npm install -g @nestjs/cli

EXPOSE 5500

CMD npm run build && npm run start:prod