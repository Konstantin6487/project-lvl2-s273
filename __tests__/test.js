import genDiff from '../src';

test('Test N1', () => {
  const expectedN1 = `{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  + verbose: true
}`;

  const resultN1 = genDiff('./__tests__/__fixtures__/file_before_1.json', './__tests__/__fixtures__/file_after_1.json');
  expect(resultN1).toEqual(expectedN1);
});

test('Test N2', () => {
  const expectedN2 = `{
    host: github.io
    lang: ru
    version: 101
  + timeout: 40
  - timeout: 0
  + connection: false
  - connection: true
  - description: none
}`;
  const resultN2 = genDiff('./__tests__/__fixtures__/file_before_2.json', './__tests__/__fixtures__/file_after_2.json');
  expect(resultN2).toEqual(expectedN2);
});
