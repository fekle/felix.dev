DOCKER_NAME = "docker.felix.dev/felix/felix.dev/web:latest"

.PHONY: *

docker-build:
	docker build --pull -t $(DOCKER_NAME) .

docker-push:
	docker push $(DOCKER_NAME)
