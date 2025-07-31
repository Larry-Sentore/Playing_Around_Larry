#!/bin/bash

touch api.js

echo "Enter your Docker Hub username:"
read DOCKER_USERNAME

echo  "Enter your project name (e.g., song_recommender):"
read PROJECT_NAME

IMAGE_TAG="v1"
FULL_IMAGE_NAME="${DOCKER_USERNAME}/${PROJECT_NAME}:${IMAGE_TAG}"

echo "export const X_RapidAPI_Key = \"1e08537e29mshdca8ee9a7efb6fdp1293ebjsnb66d8ecbe71d\";" > api.js

echo "Building Docker image: $FULL_IMAGE_NAME"
docker build -t $FULL_IMAGE_NAME .

rm api.js

echo " Pushing image to Docker Hub..."
docker push $FULL_IMAGE_NAME

echo "Creating Docker network 'webnet'..."
docker network create webnet

echo "Starting web-01 container on port 8081..."
docker run -d --name web-01 --network webnet -p 8081:80 $FULL_IMAGE_NAME

echo "Starting web-02 container on port 8082..."
docker run -d --name web-02 --network webnet -p 8082:80 $FULL_IMAGE_NAME

echo " Starting HAProxy load balancer (lb-01) on port 8080..."
 docker run -d --name lb-01 --network webnet -p 8080:80 -v $(pwd)/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro haproxy:alpine

echo “ Deployment complete!"
echo " Access Load Balancer at: http://localhost:8080"
echo " Web Server 1: http://localhost:8081"
echo "Web Server 2: http://localhost:8082"



