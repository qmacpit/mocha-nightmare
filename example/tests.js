describe('example test suite', function() {

  it('tc_1', function(done) {
    console.log('log from tc_1');
    done();
  });

  it('tc_2', function() {

    const SEARCH_FIELD_SELECTOR = 'uh-search-box';
    const TEXT = 'sample search term';

    document.getElementById(SEARCH_FIELD_SELECTOR).value = TEXT;
    if (document.getElementById('uh-search-box').value !== TEXT) {
      throw new Error('search term is different then expected');
    }

  });

});