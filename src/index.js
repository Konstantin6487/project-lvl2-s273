import render from './render';
import makeAstDiff from './ast';

export default (pathBeforeData, pathAfterData) =>
  render(makeAstDiff(pathBeforeData, pathAfterData));
