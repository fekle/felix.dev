# base image
FROM --platform=linux/amd64 ubuntu:18.04 AS build-base
WORKDIR /tmp/hugo-build

# install apt deps
RUN apt-get -y update -q && \
    apt-get -y install --no-install-recommends build-essential curl gnupg zopfli parallel ca-certificates apt-transport-https gnupg lsb-release dh-autoreconf &&  \
    apt-get -y clean -q

# install node and yarn
ARG NODE_VERSION=12
RUN curl -sL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | bash - && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list && \
    apt-get -y update -q && \
    apt-get -y install --no-install-recommends nodejs yarn && \
    apt-get -y clean -q

# install hugo (https://github.com/gohugoio/hugo/releases)
ARG HUGO_VERSION=0.69.0
RUN curl -Lso /tmp/hugo.deb "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-$(arch | sed 's/x86_64/64bit/g' | sed 's/aarch64/ARM64/').deb" && \
    dpkg -i /tmp/hugo.deb && rm -rf /tmp/hugo.deb

# build image
FROM build-base AS build

# install yarn dependencies
COPY package.json yarn.lock /tmp/hugo-build/
RUN yarn install --prefer-offline --non-interactive --frozen-lockfile

# build static site
COPY . /tmp/hugo-build/
RUN yarn exec gulp build:prod

# web image
FROM nginx:latest

# ports
EXPOSE 80
EXPOSE 8080

# copy nginx config
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf

# copy static files
COPY --from=build --chown=nginx:nginx /tmp/hugo-build/dist /var/www/felix.dev
