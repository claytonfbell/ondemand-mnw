#!/bin/bash
git pull
docker build ./ -t ondemand-mnw
docker container stop ondemand-mnw
docker container rm ondemand-mnw
docker run -d -p 127.0.0.1:3000:3000/tcp --name=ondemand-mnw --restart=unless-stopped --add-host host.docker.internal:host-gateway ondemand-mnw
