FROM node:16.0.0 AS build

WORKDIR /app
COPY app/package*.json .
RUN npm install
COPY app/ .
RUN npm run build

FROM nginx:1.17.1-alpine
COPY config/config.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
