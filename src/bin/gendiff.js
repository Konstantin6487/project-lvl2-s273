#!/usr/bin/env node

import program from 'commander';
import genDiff from '..';

program
  .version('0.1.3')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'Output format')
  .action((firstConfig, secondConfig) => console.log(genDiff(firstConfig, secondConfig)));

program
  .description('Compares two configuration files and shows a difference.');

program.parse(process.argv);
