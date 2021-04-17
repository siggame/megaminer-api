#! /bin/sh

docker build . -t mmai-api

docker run -it \
--network="mmai-backend-network"
--mount type=bind,source="$(pwd)"/configs,target=/usr/app/configs \
-p 127.0.0.1:3000:3000 mmai-api