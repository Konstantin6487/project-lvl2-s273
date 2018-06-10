import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parseData from './parsers';


// Read data from path
const getFormat = pathToFile => path.extname(pathToFile);
const getData = pathToFile => fs.readFileSync(pathToFile, 'utf8');


// Make AST with differences
const isValue = (...list) => {
  const checkFns = [_.isString, _.isBoolean, _.isNumber];
  return list.every(el => checkFns.some(fn => fn(el)));
};

const hasChildren = item => _.isObject(item);

const makeNode = (key = '', children = [], value = '', flag = ' ') => ({
  key,
  children,
  value,
  flag,
});

const makeChildren = (obj) => {
  const objKeys = Object.keys(obj);
  return objKeys.map((item) => {
    if (hasChildren(obj[item])) {
      return ({ key: item, children: makeChildren(obj[item]), flag: ' ' });
    }
    return makeNode(item, [], obj[item]);
  });
};

const makeAstDiff = (beforeData, afterData) => {
  const inner = (b, a) => {
    const beforeDataKeys = Object.keys(b);
    const afterDataKeys = Object.keys(a);
    const unionKeys = _.union(beforeDataKeys, afterDataKeys);
    return unionKeys.map((item) => {
      if (beforeDataKeys.includes(item) && !afterDataKeys.includes(item)) {
        if (isValue(b[item])) {
          return makeNode(item, [], b[item], '-');
        }
        if (hasChildren(b[item])) {
          return makeNode(item, makeChildren(b[item]), '', '-');
        }
      }

      if (!beforeDataKeys.includes(item) && afterDataKeys.includes(item)) {
        if (isValue(a[item])) {
          return makeNode(item, [], a[item], '+');
        }
        if (hasChildren(a[item])) {
          return makeNode(item, makeChildren(a[item]), '', '+');
        }
      }

      if (beforeDataKeys.includes(item) && afterDataKeys.includes(item)) {
        if (b[item] === a[item]) {
          return makeNode(item, [], a[item]);
        }
        if (b[item] !== a[item] && isValue(b[item], a[item])) {
          return [{ key: item, value: a[item], flag: '+' }, { key: item, value: b[item], flag: '-' }];
        }
        if (hasChildren(b[item]) && hasChildren(a[item])) {
          return makeNode(item, _.flatten(inner(b[item], a[item])));
        }
        return hasChildren(b[item]) && isValue(a[item])
          ? [makeNode(item, makeChildren(b[item]), '', '-'), makeNode(item, [], a[item], '+')]
          : [makeNode(item, [], b[item], '-'), makeNode(item, makeChildren(a[item]), '', '+')];
      }
      return false;
    });
  };
  return inner(beforeData, afterData);
};


// Render AST
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


// Generate difference
export default (pathBeforeData, pathAfterData) => {
  const beforeData = getData(pathBeforeData);
  const formatBeforeData = getFormat(pathBeforeData);
  const parsedBeforeData = parseData(beforeData, formatBeforeData);

  const afterData = getData(pathAfterData);
  const formatAfterData = getFormat(pathAfterData);
  const parsedAfterData = parseData(afterData, formatAfterData);

  const astDiff = makeAstDiff(parsedBeforeData, parsedAfterData);
  const renderedDiff = render(astDiff);
  return renderedDiff;
};
