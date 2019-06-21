#!/bin/sh

containers=`docker container ls -a | grep warehouse | awk '{print $1}'`

docker container stop ${containers}
docker container rm ${containers}
docker image rm $(docker image ls | grep warehouse | awk '{print $3}')

containers=`docker container ls -a | grep payments | awk '{print $1}'`

docker container stop ${containers}
docker container rm ${containers}
docker image rm $(docker image ls | grep payments | awk '{print $3}')
