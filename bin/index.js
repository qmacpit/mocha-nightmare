#!/usr/bin/env node
'use strict';

const path = require('path')
const program = require('commander');

const initLogger = require('../src/logger');

const PARAMS_REQUIRED = [
  'resources', 'url'
];

const checkRequiredParam = param => {
  if (!program[param]) {
    logger.error(`\n${param} must be defined`);
    program.outputHelp();
    process.exit();
  }
}



program
  .option('-u, --url <path>', 'tested page url')
  .option('-w, --warmup <n>', 'a warmup timeout to be waited before launching tests [ms]', 0)
  .option('-l, --lifespan <n>', 'a lifespan timeout after which test app will be terminated (if tests freeze) [ms]')
  .option('-r, --resources <path>', 'path to configuration json file')
  .option('-h, --headfull', 'displays electron UI', false)
  .option('-e, --endless', 'do not terminate electron UI afere all tests have been run')
  .option('-v, --verbose', 'print verbose info')
  .parse(process.argv);

//init logger
const logger = initLogger(program.verbose);

PARAMS_REQUIRED.forEach(checkRequiredParam);

require('../src/tester')({
  resources: program.resources,
  url      : program.url,
  warmup   : program.warmup,
  lifespan : program.lifespan,
  headfull : program.headfull,
  endless  : program.endless
});