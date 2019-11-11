DIST_DIR=dist
.PHONY: *

clean:
	rm -rf ./dist

watch: clean
	hugo server --cleanDestinationDir --verbose --watch

build: build-dev

build-dev: clean
	hugo --cleanDestinationDir

build-prod: clean
	hugo --cleanDestinationDir --minify