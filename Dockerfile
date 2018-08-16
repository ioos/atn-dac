FROM angrybytes/sphinx
WORKDIR /tmp
RUN apk add --update make git
RUN git clone https://github.com/ioos/atn-docs.git && cd atn-docs && make json

FROM node:10
RUN mkdir -p /srv/app
WORKDIR /srv/app
COPY ./ ./
COPY --from=0 /tmp/atn-docs/_build/json/ /srv/app/src/help/
RUN npm install && npm run build

FROM nginx:1.15
COPY --from=1 /srv/app/dist /usr/share/nginx/html

