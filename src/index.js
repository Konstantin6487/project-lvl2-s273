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

const readData = (pathToFile) => {
  const format = path.extname(pathToFile);
  const data = fs.readFileSync(pathToFile, 'utf8');
  return { format, data };
};

const parseData = (dataObj) => {
  const parse = getParser(dataObj.format);
  const config = parse(dataObj.data);
  return config;
};

export default (pathToFile1, pathToFile2) => {
  const file1 = parseData(readData(pathToFile1));
  const file2 = parseData(readData(pathToFile2));
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
