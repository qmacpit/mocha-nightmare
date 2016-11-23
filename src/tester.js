const path = require('path');
const Nightmare = require('nightmare');

const logger = require('./logger')();

const TEST_SETUP_RESOURCES = [
  './public/resources/mocha.js',
  './public/resources/webConsole.js',
  './public/mochaSetup.js'
];
const TEST_RUNNER_PATH = './public/testRunner.js';
const FETCH_RESULTS_RETRY_INTERVAL = 500;

/**
 * Browser function
 * Run an interval and checks if test resuls have been generated
 */
function fetchTestsResults(nightmare, callback) {

  function retry() {
    nightmare
      .evaluate(() => window.__TEST_RESULTS)
      .then(testResults => {
        if (!testResults) {
          return setTimeout(retry, FETCH_RESULTS_RETRY_INTERVAL);
        }
        callback(testResults);
      });
  }

  retry();
}

const installLifespan = lifespan => {

  logger(`installing lifespan timeout ${lifespan}`);
  setTimeout(
    () => {
      logger('finishing due to lifespan timeout has expired....');
      process.exit();
    },
    lifespan
  );

};

module.exports = config => {

  logger('configuration:')
  logger(config);

  const nightmare = Nightmare({
    openDevTools: {
      mode: 'detach'
    },
    show: config.headfull
  });

  const resourceFilePath = path.resolve(process.cwd(), config.resources);
  let configFile;

  try {
    configFile = require(resourceFilePath);
  } catch (err) {
    logger.error(`error while loading resources file: ${resourceFilePath}`);
    logger.error(err.stack);
    process.exit();
  }

  if (config.lifespan) {
    installLifespan(config.lifespan);
  }

  const loadTestResource = filePath => path.resolve(path.dirname(resourceFilePath), filePath)
  const loadResource = filePath => path.resolve(__dirname, filePath)

  const resources = [
    ...TEST_SETUP_RESOURCES.map(loadResource),
    ...configFile.testResources.map(loadTestResource),
    loadResource(TEST_RUNNER_PATH)
   ];

  //open page
  nightmare
    .goto(config.url)
    .wait(config.warmup);

  //load resources
  resources.forEach(current => {
    logger(`injecting: ${current}`);
    nightmare.inject('js', current);
  });

  nightmare
    .then(() => {

      logger('running tests');

      fetchTestsResults(nightmare, testResults => {

        logger('logs collected');
        process.stdout.write(testResults);

        if (!config.endless) {
          process.exit();
        }

      });

    });
};