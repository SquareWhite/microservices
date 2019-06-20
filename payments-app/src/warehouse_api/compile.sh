#!/bin/sh
docker run -v $PWD:/data --rm thrift thrift -o /data --gen py /data/warehouse.thrift
sudo chmod -R 777 ./gen-py
