DIST_DIR=dist
.PHONY: *

export PATH := /home/linuxbrew/.linuxbrew/bin:$(PATH)

clean:
	rm -rf ./dist

watch: clean
	hugo server --cleanDestinationDir --verbose --watch

build: build-dev

build-dev: clean
	hugo --cleanDestinationDir

build-prod: clean
	hugo --cleanDestinationDir --minify

fmt:
	prettier --write './**/*.{js,ts,jsx,tsx,json,css,scss,pcss}'