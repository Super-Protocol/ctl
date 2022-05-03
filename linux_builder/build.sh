#!/bin/bash

set -a
docker build -f ./Dockerfile --tag temp-linux_builder --build-arg NPM_TOKEN="$1" ..
id=$(docker create temp-linux_builder)
mkdir -p ../dist
docker cp $id:/app/dist/spctl ../dist/spctl-linux
docker rm $id
