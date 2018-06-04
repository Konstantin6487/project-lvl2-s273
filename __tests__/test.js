import fs from 'fs';
import genDiff from '../src';


test('Test N1', () => {
  const expectedN1 = fs.readFileSync('./__tests__/__fixtures__/file_result_1', 'utf8');
  const resultN1 = genDiff('./__tests__/__fixtures__/file_before_1.json', './__tests__/__fixtures__/file_after_1.json');
  expect(resultN1).toBe(expectedN1);
});

test('Test N2', () => {
  const expectedN2 = fs.readFileSync('./__tests__/__fixtures__/file_result_2', 'utf8');
  const resultN2 = genDiff('./__tests__/__fixtures__/file_before_2.json', './__tests__/__fixtures__/file_after_2.json');
  expect(resultN2).toBe(expectedN2);
});
