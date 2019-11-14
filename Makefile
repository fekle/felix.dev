DOCKER_NAME="docker.felix.dev/felix.dev:latest"
DIST_DIR=dist
.PHONY: *

all: build-prod

clean:
#	find . -type d -name '_gen' -print0 | xargs -0 rm -rf

watch: clean
	hugo server --watch

build: build-dev

build-dev: clean
	env NODE_ENV=development hugo --gc --cleanDestinationDir

build-prod: clean
	env NODE_ENV=production hugo --gc --cleanDestinationDir --minify

fmt:
	prettier --write './**/*.{js,ts,jsx,tsx,json,css,scss,pcss}'

docker-build:
	docker build -t $(DOCKER_NAME) .

docker-push:
	docker push $(DOCKER_NAME)