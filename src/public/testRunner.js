var buffer = "";
console._log = console.log;

if (window.__REPORTER === 'xunit') {
  //if we use xunit reporter we have prepare env
  //for being able to fetch xml tests results and save them in a file
  console.log = function(data) {
    if (data[0] !== "<") {
      return console._log(data);
    }
    buffer += data;
    console._log(data);
  }
} else {
  console.log = function(data) {
    buffer += data;
    console._log(data);
  }
}

var runner = mocha.run();
runner.on('end', function(){
  console._log("tests run finished")
  // console._log(buffer)
  window.__TEST_RESULTS = buffer;
});