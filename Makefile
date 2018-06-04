install:
	npm install -s

start:
	npm run babel-node -- src/bin/gendiff.js

publish:
	npm publish -s
