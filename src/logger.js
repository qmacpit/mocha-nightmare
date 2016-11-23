const colors = require('colors');

var logger;
var verbose;

const prettyLog = msg => typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)

/**
 * Logger utitlity
 * First function call create and initialize logging function
 * After initialization use it like this:
 * logger('message') - for verbose output
 * logger.error('message') - for verbose input
 */
module.exports = isVerbose => {

  if (logger) {
    return logger;
  }

  verbose = isVerbose;

  logger = msg => isVerbose ? console.log(colors.cyan(prettyLog(msg))) : null;
  logger.error = msg => console.log(colors.red(prettyLog(msg)));
  logger.info = msg => isVerbose ? console.log(colors.magenta(prettyLog(msg))) : null;
  return logger;
}