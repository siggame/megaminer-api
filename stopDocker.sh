#! /bin/sh

docker rm $(docker kill $(docker ps -a -q --filter ancestor=mmai-api --format="{{.ID}}"))