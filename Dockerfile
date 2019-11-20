# build image
FROM node:dubnium-buster-slim AS build
WORKDIR /tmp/hugo-build

# install apt deps
RUN apt-get -y update -qq && apt-get -y install make parallel zopfli

# install hugo
ARG HUGO_VERSION=0.59.1
ADD https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.deb /tmp/hugo.deb
RUN dpkg -i /tmp/hugo.deb

# install yarn dependencies
COPY package.json yarn.lock /tmp/hugo-build/
RUN yarn install --prefer-offline --non-interactive --frozen-lockfile

# build static site
COPY . /tmp/hugo-build/
RUN ./node_modules/.bin/gulp build:prod

# web image
FROM nginx:alpine

# ports
EXPOSE 80
EXPOSE 8080

# copy nginx config
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf

# copy static files
COPY --from="build" --chown=nginx:nginx /tmp/hugo-build/dist /var/www/web

