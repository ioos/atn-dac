FROM node:10
RUN mkdir -p /srv/app
WORKDIR /srv/app
COPY ./ ./
RUN npm install && npm run build

FROM nginx:1.15
COPY --from=0 /srv/app/dist /usr/share/nginx/html

