#!/bin/bash

if [[ ! -e $PWD/libs ]]; then
    mkdir $PWD/libs
fi

cp $PWD/node_modules/uplink-nodejs/libuplinkcv*.* $PWD/libs
