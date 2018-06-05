import fs from 'fs';
import genDiff from '../src';

describe('gendiff', () => {
  const expected = fs.readFileSync('./__tests__/__fixtures__/test1_result', 'utf8');
  it('Test N1.json', () => {
    const result = genDiff('./__tests__/__fixtures__/test1_before.json', './__tests__/__fixtures__/test1_after.json');
    expect(result).toBe(expected);
  });
  it('Test N1.yml', () => {
    const result = genDiff('./__tests__/__fixtures__/test1_before.yml', './__tests__/__fixtures__/test1_after.yml');
    expect(result).toBe(expected);
  });
});
