'use strict';

describe('Directive: addTorrentModal', function () {

  // load the directive's module
  beforeEach(module('torrentSubscribeFrontendApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<add-torrent-modal></add-torrent-modal>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the addTorrentModal directive');
  }));
});
