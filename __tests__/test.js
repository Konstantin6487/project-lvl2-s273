import fs from 'fs';
import genDiff from '../src';


test('Test N1.json', () => {
  const expectedN1 = fs.readFileSync('./__tests__/__fixtures__/test1_result', 'utf8');
  const resultN1 = genDiff('./__tests__/__fixtures__/test1_before.json', './__tests__/__fixtures__/test1_after.json');
  expect(resultN1).toBe(expectedN1);
});

test('Test N1.yml', () => {
  const expectedN1 = fs.readFileSync('./__tests__/__fixtures__/test1_result', 'utf8');
  const resultN1 = genDiff('./__tests__/__fixtures__/test1_before.yml', './__tests__/__fixtures__/test1_after.yml');
  expect(resultN1).toBe(expectedN1);
});

test('Test N2.json', () => {
  const expectedN2 = fs.readFileSync('./__tests__/__fixtures__/test2_result', 'utf8');
  const resultN2 = genDiff('./__tests__/__fixtures__/test2_before.json', './__tests__/__fixtures__/test2_after.json');
  expect(resultN2).toBe(expectedN2);
});

test('Test N2.yml', () => {
  const expectedN2 = fs.readFileSync('./__tests__/__fixtures__/test2_result', 'utf8');
  const resultN2 = genDiff('./__tests__/__fixtures__/test2_before.yml', './__tests__/__fixtures__/test2_after.yml');
  expect(resultN2).toBe(expectedN2);
});
