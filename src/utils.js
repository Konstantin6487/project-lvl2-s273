import _ from 'lodash';

export default (...list) => {
  const checkFns = [_.isString, _.isBoolean, _.isNumber];
  return list.every(el => checkFns.some(fn => fn(el)));
};
