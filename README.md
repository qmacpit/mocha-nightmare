# mocha-nightmare
![alt tag](https://media.giphy.com/media/NMNOUT8CI3Owg/giphy.gif)
## Caution

This is very early days concept :| You shouldn't expect too much out otf it. Created for a specific purpose which is far more important then the tool itself.

## Motivation

**Because javascript UI tests should be run in the browser :]** <br />
This is a different idea of running UI tests:
instead of using API that allows you to manipulate the browser like nightwatch, selenium or nightmare it lets you run your tests  directly in the browser.

##  How it works

It's very simple :] mocha-nightmare does the following things:
- launches nightmare (headless or headfull)
- sets up mocha test environment
- opens tested webpage
- injects you js files to the tested webpage context
- runs tests
- returns test results in xunit XML format

## Usage

You might want to install it globally
```
npm i mocha-nightmare -g
```
prepare json configuration file
```js
{
  "testResources": [
    "<path_to_js_file_you_want_be_injected_to_the_browser>"
  ]
}
```
run tests
```
mocha-nightmare -u http://<tested_page_url> -r <json_configuration_file_path>
```
check output (example printout)
```xml
<testsuite name="Mocha Tests" tests="1" failures="0" errors="0" skipped="0" timestamp="Tue, 22 Nov 2016 13:14:01 GMT" time="0.035">
  <testcase classname="example test suite" name="example test" time="0"/>
</testsuite>
```

### cmd options
```bash
mocha-nightmare --help

  Usage: index [options]

  Options:

    -h, --help              output usage information
    -u, --url <path>        tested page url
    -w, --warmup <n>        a warmup timeout to be waited before launching tests [ms]
    -l, --lifespan <n>      a lifespan timeout after which test app will be terminated (if tests freeze) [ms]
    -r, --resources <path>  path to configuration json file
    -h, --headfull          displays electron UI
    -e, --endless           do not terminate electron UI afere all tests have been run
    -v, --verbose           print verbose info
```
## Example

go to  ```example/``` folder
run tests
```
./run.sh
```

## Tests

TO BE DONE... :

## TODO

at least:
- tests
- linting
- mocha & webConsole are a bit out of date

### Troubleshooting

```
DEBUG=* mocha-nightmare -u http://<tested_page_url> -r <json_configuration_file_path> -v
```
### Running in headless environment

this applies to ubunut server 16.04 only
 - install missing libs
 ```bash
 sudo apt install libxss1
 ```
 - install xvfb
 ```bash
 sudo apt install xvfb
 ```
 - use xvfb-run to run
 ```bash
 xvfb-run mocha-nightmare -u http://<tested_page_url> -r <json_configuration_file_path> -v
 ```
