#!/bin/sh
docker run -v $PWD:/data thrift thrift -o /data --gen js:node /data/warehouse.thrift
sudo chmod -R 777 ./gen-nodejs
