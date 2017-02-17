
//this is a nasty way of initializing reporter
var reporter = window.__REPORTER === 'xunit' ? 'xunit' : WebConsole;
mocha.setup({
  ui:'bdd',
  reporter: reporter
});
mocha.checkLeaks();
mocha.globals(['jQuery']);

function notify(contextName, name) {
  console.log('\n');
  console.log('== EXECUTING ' + contextName + ' ==');
  console.log('== ' + name + ' ==');
}

//override mocha's describe function
//we would like to have anappropriate log printed so we cen easily distinguish each test suite
window._describe = window.describe;
window.describe = function(suiteName) {
  notify('suite', suiteName);
  window._describe.apply(this, arguments);
};


//override mocha's it function
//we would like to have an appropriate log printed so we cen easily distinguish each TC logs
window._it = window.it;
window.it = function(tcName, testFn) {

  //this hack allows us to trick mocha a little bit and handle sync and async test cases
  var isAsyncTest = testFn.length !== 0;
  var runTc = function() {
    notify('tc', tcName);
    testFn.apply(this, arguments);
  };

  window._it.call(
    this,
    tcName,
    isAsyncTest
      ? function(done) { runTc.call(this, done); }
      : function() { runTc.call(this); }
  );
};