import fs from 'fs';
import _ from 'lodash';
import yaml from 'js-yaml';
import path from 'path';

const parsers = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.yml': yaml.safeLoad,
};

const getParser = format => (data) => {
  const parse = parsers[format];
  if (!parse) {
    throw new Error(`unkown format: ${format}`);
  }
  return parse(data);
};

const readParseData = (pathToFile) => {
  if (!pathToFile) {
    return '';
  }
  const format = path.extname(pathToFile);
  const data = fs.readFileSync(pathToFile, 'utf8');
  const parse = getParser(format);
  const config = parse(data);
  return config;
};

export default (pathToFile1, pathToFile2) => {
  if (!pathToFile1 && !pathToFile2) {
    return 'Files not found';
  }
  const file1 = readParseData(pathToFile1) || {};
  const file2 = readParseData(pathToFile2) || {};
  const filesKeys = _.union(Object.keys(file1), Object.keys(file2));
  const result = filesKeys.map((key) => {
    if (!_.has(file1, key)) {
      return `  + ${key}: ${file2[key]}`;
    }
    if (!_.has(file2, key)) {
      return `  - ${key}: ${file1[key]}`;
    }
    if (_.has(file1, key) && file1[key] !== file2[key]) {
      return [`  + ${key}: ${file2[key]}`, `  - ${key}: ${file1[key]}`];
    }
    return `    ${key}: ${file2[key]}`;
  });
  return `{\n${_.flatten(result).join('\n')}\n}\n`;
};
