# base image
FROM ubuntu:18.04 AS base
WORKDIR /tmp/hugo-build

# install apt deps
RUN apt-get -y update -qq && \
    apt-get -y install curl gnupg zopfli parallel &&  \
    apt-get -y clean -q

# install node and yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list && \
    apt-get -y update -qq && \
    apt-get -y install yarn && \
    apt-get -y clean -q

# install hugo (https://github.com/gohugoio/hugo/releases)
ARG HUGO_VERSION=0.60.1
RUN curl -Lso /tmp/hugo.deb "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.deb" && \
    dpkg -i /tmp/hugo.deb && rm -rf /tmp/hugo.deb

# build image
FROM base AS build

# install yarn dependencies
COPY package.json yarn.lock /tmp/hugo-build/
RUN yarn install --prefer-offline --non-interactive --frozen-lockfile

# build static site
COPY . /tmp/hugo-build/
RUN yarn exec gulp build:prod

# web image
FROM nginx:alpine

# ports
EXPOSE 80
EXPOSE 8080

# copy nginx config
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf

# copy static files
COPY --from=build --chown=nginx:nginx /tmp/hugo-build/dist /var/www/felix.dev