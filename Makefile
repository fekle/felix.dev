DOCKER_NAME="docker.felix.dev/felix.dev:latest"
DIST_DIR=dist
.PHONY: *

all: build-prod

clean:
	rm -rf ./dist

watch: clean
	env NODE_ENV=development hugo server --gc --cleanDestinationDir --watch

build: build-dev

build-dev: clean
	env NODE_ENV=development hugo --gc --cleanDestinationDir

build-prod: clean
	env NODE_ENV=production hugo --gc --cleanDestinationDir --minify
	env NODE_ENV=production ./node_modules/.bin/purgecss -c purgecss.config.js -o dist/css

fmt:
	prettier --write './**/*.{js,ts,jsx,tsx,json,css,scss,pcss}'

docker-build:
	docker build -t $(DOCKER_NAME) .

docker-push:
	docker push $(DOCKER_NAME)