FROM node:16.0.0

WORKDIR /app
COPY app/package*.json ./
RUN npm install
COPY app/ .
CMD node app.js
