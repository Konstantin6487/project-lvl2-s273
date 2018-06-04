#!/usr/bin/env node

import program from 'commander';

program
  .version('0.0.4')
  .arguments('<firstConfig>, <secondConfig>')
  .option('-f, --format [type]', 'Output format');

program
  .description('Compares two configuration files and shows a difference.');

program.parse(process.argv);
