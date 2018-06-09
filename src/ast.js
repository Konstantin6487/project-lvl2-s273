import _ from 'lodash';
import isStrBoolNum from './utils';
import { readData, parseData } from './parsers';

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

export default makeAstDiff;
