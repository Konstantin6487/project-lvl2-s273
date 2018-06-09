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

const makeAst = (obj) => {
  const objKeys = Object.keys(obj);
  return objKeys.map((item) => {
    if (_.isObject(obj[item])) {
      return ({ key: item, children: makeAst(obj[item]), flag: ' ' });
    }
    return {
      key: item,
      children: [],
      value: obj[item],
      flag: ' ',
    };
  });
};
const isStrBoolNum = (...list) => {
  const checkFns = [_.isString, _.isBoolean, _.isNumber];
  return list.every(el => checkFns.some(fn => fn(el)));
};

const makeAstDiff = (pathBeforeData, pathAfterData) => {
  const beforeData = parseData(readData(pathBeforeData));
  const afterData = parseData(readData(pathAfterData));

  const iter = (b, a) => {
    const beforeDataKeys = Object.keys(b);
    const afterDataKeys = Object.keys(a);
    const unionKeys = _.union(beforeDataKeys, afterDataKeys);

    return unionKeys.map((item) => {
      if (beforeDataKeys.includes(item) && !afterDataKeys.includes(item)) {
        if (isStrBoolNum(b[item])) {
          return { key: item, value: b[item], flag: '-' };
        }
        if (_.isObject(b[item])) {
          return { key: item, children: makeAst(b[item]), flag: '-' };
        }
      }

      if (!beforeDataKeys.includes(item) && afterDataKeys.includes(item)) {
        if (isStrBoolNum(a[item])) {
          return { key: item, value: a[item], flag: '+' };
        }
        if (_.isObject(a[item])) {
          return {
            key: item,
            children: makeAst(a[item]),
            value: '',
            flag: '+',
          };
        }
      }

      if (beforeDataKeys.includes(item) && afterDataKeys.includes(item)) {
        if (b[item] === a[item]) {
          return { key: item, value: a[item], flag: ' ' };
        }

        if (b[item] !== a[item] && isStrBoolNum(b[item], a[item])) {
          return [{ key: item, value: a[item], flag: '+' }, { key: item, value: b[item], flag: '-' }];
        }

        if (_.isObject(b[item]) && _.isObject(a[item])) {
          return {
            key: item,
            children: _.flatten(iter(b[item], a[item])),
            value: '',
            flag: ' ',
          };
        }

        return _.isObject(b[item]) && isStrBoolNum(a[item])
          ? [{
            key: item,
            children: makeAst(b[item]),
            value: '',
            flag: '-',
          },
          {
            key: item,
            value: a[item],
            flag: '+',
          }]
          : [
            {
              key: item,
              value: b[item],
              flag: '-',
            },
            {
              key: item,
              children: makeAst(a[item]),
              value: '',
              flag: '+',
            }];
      }
      return false;
    });
  };
  return iter(beforeData, afterData);
};

const render = (ast) => {
  const flatAst = _.flatten(ast);
  const inner = (tree, deps = 1) => tree.map((item) => {
    if (!_.isEmpty(item.children)) {
      return `${item.flag} ${item.key}: {\n${inner(item.children, deps + 4).map(i => `${' '.repeat(5 + deps)}${i}`).join('\n')}\n${' '.repeat(deps + 3)}}`;
    }
    return `${item.flag} ${item.key}: ${item.value}`;
  });
  return `{\n${inner(flatAst).map(i => `${' '.repeat(2)}${i}`).join('\n')}\n}\n`;
};


export default (pathBeforeData, pathAfterData) =>
  render(makeAstDiff(pathBeforeData, pathAfterData));
