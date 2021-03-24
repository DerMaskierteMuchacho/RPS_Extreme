im directory mit Dockerfile

image builden: docker build -t node-web-app .
container laufen lassen: docker run -p 49160:8080 -d node-web-app

erreichbar über localhost:49160

https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
