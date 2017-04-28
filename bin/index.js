#!/usr/bin/env node
'use strict';

const path = require('path')
const program = require('commander');

const initLogger = require('../src/logger');

const PARAMS_REQUIRED = [
  'resources', 'url'
];
const RESULTS_FILE_NAME = 'results.xml';
const REPORTERS = {
  WEB_CONSOLE: 'webConsole',
  XUNIT      : 'xunit'
};

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
  .option('-o, --output <path>', 'path to test output file', RESULTS_FILE_NAME)
  .option('--xunit', 'uses xunit mocha reporter, WebConsole used by default')
  .option('--disable-security', 'disable web security in electron (i.e. to allow cross-domain requests)')
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
  endless  : program.endless,
  //we use output file only in case of xunit reporter
  //WebConsole reults are not meant to be written into file
  output   : program.xunit ? program.output : false,
  //for simplicity we doesn't allow to define other reporter types
  //most of mocha's build-in reportes are meant to be used with node.js
  //right we can use a default WebConsole reporter or XUnit reporter usefull for CI
  reporter : program.xunit ? REPORTERS.XUNIT : REPORTERS.WEB_CONSOLE,
  disableSecurity: program.disableSecurity
});