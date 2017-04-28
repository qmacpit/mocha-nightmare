const path = require('path');
const fs = require('fs');
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
function fetchTestsResults(nightmare, onTestResults) {

  function retry() {
    nightmare
      //fetch tets results
      .evaluate(() => window.__TEST_RESULTS)
      .then(testResults => {
        if (!testResults) {
          return setTimeout(retry, FETCH_RESULTS_RETRY_INTERVAL);
        }
        onTestResults(testResults);
      });
  }

  retry();
}

const setReporter = (nightmare, reporter) => {
  return nightmare
    .evaluate((testReporter) => window.__REPORTER = testReporter, reporter)
}

/**
 * Install test run lifespan
 * Terminate the program after lifespan timeout expires
 * Can be used for prevening the program to run endlessly
 */
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


/**
 * Prepare an array of js resources to be injecteed to the browser
 * Combine test runner resources with user defined js files
 */
const prepareResources = (configFile, configFilePath) => {

  logger(`preparing resources for ${configFilePath}`);

  const loadTestResource = filePath => path.resolve(path.dirname(configFilePath), filePath)
  const loadResource = filePath => path.resolve(__dirname, filePath)

  return [
    ...TEST_SETUP_RESOURCES.map(loadResource),
    ...configFile.testResources.map(loadTestResource),
    loadResource(TEST_RUNNER_PATH)
   ];
};


/**
 * Try to open configuration file
 * Terminate the program if file cannot be opened
 */
const getConfigurationFile = configFilePath => {

  let configFile;

  try {
    configFile = require(configFilePath);
  } catch (err) {
    logger.error(`error while loading resources file: ${configFilePath}`);
    logger.error(err.stack);
    process.exit();
  }

  return configFile;
}

const writeOutputToFile = (path, data, callback) => {
  const writer = fs.createWriteStream(path);
  writer.on('finish', callback);
  writer.end(data);
}

module.exports = config => {

  logger('configuration:')
  logger(config);

  const nightmare = Nightmare({
    openDevTools: {
      mode: 'detach'
    },
    show: config.headfull,
    webPreferences: {
      webSecurity: !config.disableSecurity
    }
  });

  //read configuration from file
  const configFilePath = path.resolve(process.cwd(), config.resources);
  const configFile = getConfigurationFile(configFilePath);

  //prepare js resources
  const resources = prepareResources(configFile, configFilePath);

  if (config.lifespan) {
    installLifespan(config.lifespan);
  }

  nightmare
    //add handler for client side logging
    .on(
      'console',
      (type, msg) => logger.info(msg)
    )
    //open page
    .goto(config.url);

  setTimeout(
    () => {

      logger('warmup performed');
      logger(`setting reporter: ${config.reporter}`);
      //set reporter
      setReporter(nightmare, config.reporter)
        .then(() => {

          //load resources
          resources.forEach(current => {
            logger(`injecting: ${current}`);
            nightmare.inject('js', current);
          });

          //run tests
          nightmare
            .then(() => {

              logger('running tests');

              fetchTestsResults(
                nightmare,
                testResults => {
                  logger('test results collected');

                  const finish = () => config.endless ? null : process.exit()

                  if (config.output) {
                    return writeOutputToFile(config.output, testResults, finish);
                  }
                  finish();
                }
              );

            });

        });
    },
    config.warmup
  );

};