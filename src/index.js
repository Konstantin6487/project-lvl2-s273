import fs from 'fs';
import _ from 'lodash';
import yaml from 'js-yaml';
import path from 'path';
import ini from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
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
  const parsedData1 = parseData(readData(pathToFile1));
  const parsedData2 = parseData(readData(pathToFile2));
  const filesKeys = _.union(Object.keys(parsedData1), Object.keys(parsedData2));
  const result = filesKeys.map((key) => {
    if (!_.has(parsedData1, key)) {
      return `  + ${key}: ${parsedData2[key]}`;
    }
    if (!_.has(parsedData2, key)) {
      return `  - ${key}: ${parsedData1[key]}`;
    }
    if (_.has(parsedData1, key) && parsedData1[key] !== parsedData2[key]) {
      return [`  + ${key}: ${parsedData2[key]}`, `  - ${key}: ${parsedData1[key]}`];
    }
    return `    ${key}: ${parsedData2[key]}`;
  });
  return `{\n${_.flatten(result).join('\n')}\n}\n`;
};
