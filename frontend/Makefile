# AGPLv3 or later
# Copyright (c) 2014 Genome Research Limited

BIN = node_modules/.bin

# Start the server
up:
	node index.js

# Generate minified assets from the /assets folder and output it to /public.
assets:
	mkdir -p public/assets
	$(foreach file, $(shell find assets -name '*.js' | cut -d '.' -f 1), \
		$(BIN)/browserify $(file).js -t jadeify > public/$(file).js; \
		$(BIN)/uglifyjs public/$(file).js > public/$(file).min.js \
	)
	$(BIN)/stylus assets -o public/assets
	$(foreach file, $(shell find assets -name '*.styl' | cut -d '.' -f 1), \
		$(BIN)/sqwish public/$(file).css -o public/$(file).min.css \
	)

clean:
	rm -rf public/assets/*

.PHONY: up assets clean
