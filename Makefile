install:
	npm install -s

start:
	npm run babel-node -- src/bin/gendiff.js

build:
	npm run build

publish:
	npm publish -s
