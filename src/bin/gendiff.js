#!/usr/bin/env node

import program from 'commander';
import genDiff from '..';

program
  .version('0.2.4')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'Outputs (json, yml/yaml, ini)')
  .action((firstConfig, secondConfig) => console.log(genDiff(firstConfig, secondConfig)));

program
  .description('Compares two configuration files and shows a difference.');

program.parse(process.argv);
