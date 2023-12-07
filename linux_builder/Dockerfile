FROM node:16-buster as builder

RUN apt-get install g++ make python3
RUN wget https://go.dev/dl/go1.18.10.linux-amd64.tar.gz && tar -C /usr/local -xzf go1.18.10.linux-amd64.tar.gz
ENV PATH $PATH:/usr/local/go/bin

RUN mkdir /app
WORKDIR /app
COPY . .
RUN npm ci

RUN npm run build:linux
