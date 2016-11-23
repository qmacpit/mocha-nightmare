var buffer = "";

console._log = console.log;
console.log = function(data) {
  if (data[0] !== "<") {
    return console._log(data);
  }
  buffer += data;
  console._log(data);
}


var runner = mocha.reporter("xunit").run();
runner.on('end', function(){
  console._log("tests finished")
  console._log(buffer)
  window.__TEST_RESULTS = buffer;
});