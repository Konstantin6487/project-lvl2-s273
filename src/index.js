import fs from 'fs';

const parseFile = pathToFile =>
  JSON.parse(fs.readFileSync(pathToFile, 'utf8'));

const genDiff = (pathToFile1, pathToFile2) => {
  const [file1, file2] = [parseFile(pathToFile1), parseFile(pathToFile2)];
  const [keysFile1, keysFile2] = [Object.keys(file1), Object.keys(file2)];

  const addedKeys = keysFile2.filter(key => !keysFile1.includes(key));
  const deletedKeys = keysFile1.filter(key => !keysFile2.includes(key));
  const equalKeys = keysFile2.filter(key => keysFile1.includes(key) && file1[key] === file2[key]);
  const changedKeys = keysFile2.filter(key => keysFile1.includes(key) && file1[key] !== file2[key]);


  const keysActions = [
    {
      action: key => `  + ${key}: ${file2[key]}`,
      check: key => addedKeys.includes(key),
    },
    {
      action: key => `  - ${key}: ${file1[key]}`,
      check: key => deletedKeys.includes(key),
    },
    {
      action: key => `    ${key}: ${file2[key]}`,
      check: key => equalKeys.includes(key),
    },
    {
      action: key => [`  + ${key}: ${file2[key]}`, `  - ${key}: ${file2[key]}`],
      check: key => changedKeys.includes(key),
    },
  ];

  const getKeyAction = key => keysActions.find(({ check }) => check(key));

  const result = [...equalKeys, ...changedKeys, ...deletedKeys, ...addedKeys].reduce((acc, key) => {
    const outputStr = getKeyAction(key).action(key);
    return Array.isArray(outputStr) ? [...acc, ...outputStr] : [...acc, outputStr];
  }, []);
  const output = `{\n${result.join('\n')}\n}`;
  return output;
};

export default genDiff;
