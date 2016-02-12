'use strict';

describe('Service: freespace', function () {

  // load the service's module
  beforeEach(module('torrentSubscribeFrontendApp'));

  // instantiate service
  var freespace;
  beforeEach(inject(function (_freespace_) {
    freespace = _freespace_;
  }));

  it('should do something', function () {
    expect(!!freespace).toBe(true);
  });

});
