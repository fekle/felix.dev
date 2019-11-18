DOCKER_NAME = "docker.felix.dev/felix.dev:latest"
DIST_DIR = dist

HUGO = hugo --gc --cleanDestinationDir

.PHONY: *

all: build-prod

clean:
	rm -rf ./dist

watch: clean
	env NODE_ENV=development $(HUGO) server --watch -D

build: build-dev

build-dev: clean
	env NODE_ENV=development $(HUGO)

build-prod: clean
	# build site with minification enabled
	env NODE_ENV=production $(HUGO) --minify

	# perform after-build postcss (purge, minify)
#	env NODE_ENV=production ./node_modules/.bin/postcss --config resources/postcss-after -r 'dist/css/*.css'
#
#	# gzip files for gzip_static
#	find dist -type f -not -iregex '.*\.\(gz\|woff\|woff2\)$$' -print0 | parallel -0 zopfli --i5 --gzip

fmt:
	prettier --write './**/*.{js,ts,jsx,tsx,json,css,scss,pcss}'

docker-build:
	docker build --pull -t $(DOCKER_NAME) .

docker-push:
	docker push $(DOCKER_NAME)

icons:
	rm -rf themes/felix/static/favicons
	gulp -f themes/felix/resources/favicons.js favicons
	mv themes/felix/static/favicons/index.html themes/felix/layouts/partials/favicons.html