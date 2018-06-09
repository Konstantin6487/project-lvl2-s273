import yaml from 'js-yaml';
import ini from 'ini';
import fs from 'fs';
import path from 'path';

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

export { readData, parseData };
