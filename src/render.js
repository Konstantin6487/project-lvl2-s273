import _ from 'lodash';

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

export default render;
