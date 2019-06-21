#!/bin/sh

docker build -t warehouse-db warehouse-db
docker build -t warehouse-app warehouse-app
docker build -t payments-db payments-db
docker build -t payments-app payments-app

