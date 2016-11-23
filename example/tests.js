describe('example test suite', function() {

  it('example test', function() {

    const SEARCH_FIELD_SELECTOR = 'uh-search-box';
    const TEXT = 'sample search term';

    document.getElementById(SEARCH_FIELD_SELECTOR).value = TEXT;
    if (document.getElementById('uh-search-box').value !== TEXT) {
      throw new Error('search term is different then expected');
    }

  });

});