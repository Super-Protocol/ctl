FROM node:17-buster as builder

ARG NPM_TOKEN=""
RUN apt-get install g++ make python3
RUN wget https://dl.google.com/go/go1.13.linux-amd64.tar.gz && tar -C /usr/local -xzf go1.13.linux-amd64.tar.gz
ENV PATH $PATH:/usr/local/go/bin

RUN mkdir /app
WORKDIR /app
COPY . .
RUN npm config set '//npm.pkg.github.com/:_authToken' ${NPM_TOKEN}
RUN yarn install --frozen-lockfile

RUN yarn build:linux


