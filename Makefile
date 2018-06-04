install:
	npm install -s

start:
	npm run babel-node -- src/bin/gendiff.js

build:
	npm run build

publish:
	npm publish -s

lint:
	npm run eslint -- src test

test:
	npm test
