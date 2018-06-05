import fs from 'fs';
import _ from 'lodash';
import yaml from 'js-yaml';
import path from 'path';

const adapter = (pathToFile) => {
  const fileExt = path.extname(pathToFile);
  const extActions = [
    {
      extName: '.json',
      action: () => JSON.parse(fs.readFileSync(pathToFile, 'utf8')),
    },
    {
      extName: '.yml',
      action: () => yaml.safeLoad(fs.readFileSync(pathToFile, 'utf8')),
    },
  ];
  const getExtActions = fileExtName => extActions.find(({ extName }) => fileExtName === extName);
  return getExtActions(fileExt).action();
};

export default (pathToFile1, pathToFile2) => {
  const file1 = adapter(pathToFile1);
  const file2 = adapter(pathToFile2);
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
