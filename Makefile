DOCKER_NAME="docker.felix.dev/felix.dev:latest"
DIST_DIR=dist
.PHONY: *

all: build-prod

clean:
	rm -rf ./dist
	rm -rf ./resources/_gen
	rm -rf ./themes/felix/resources/_gen

watch: clean
	hugo server --cleanDestinationDir --verbose --watch

build: build-dev

build-dev: clean
	hugo --cleanDestinationDir

build-prod: clean
	env NODE_ENV=production hugo --cleanDestinationDir --minify

fmt:
	prettier --write './**/*.{js,ts,jsx,tsx,json,css,scss,pcss}'

docker-build: build-prod
	docker build -t $(DOCKER_NAME) .

docker-push:
	docker push $(DOCKER_NAME)

kube-dev: dist
	docker build -q -t $(DEV_IMAGE) -t $(DEV_IMAGE_LATEST) ./
	docker push $(DEV_IMAGE)
	docker push $(DEV_IMAGE_LATEST)
	sleep 0.25
	microk8s.kubectl -n dev set image --record deployments -l dm-image=web web=$(DEV_IMAGE)

