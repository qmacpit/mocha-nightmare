mocha.setup({
  ui:'bdd',
  reporter:WebConsole
});
mocha.checkLeaks();
mocha.globals(['jQuery']);