'use strict';

describe('Filter: bytes', function () {

  // load the filter's module
  beforeEach(module('torrentSubscribeFrontendApp'));

  // initialize a new instance of the filter before each test
  var bytes;
  beforeEach(inject(function ($filter) {
    bytes = $filter('bytes');
  }));

  it('should return the input prefixed with "bytes filter:"', function () {
    var text = 'angularjs';
    expect(bytes(text)).toBe('bytes filter: ' + text);
  });

});
