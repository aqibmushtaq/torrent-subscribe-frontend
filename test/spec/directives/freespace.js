'use strict';

describe('Directive: freeSpace', function () {

  // load the directive's module
  beforeEach(module('torrentSubscribeFrontendApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<free-space></free-space>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the freeSpace directive');
  }));
});
