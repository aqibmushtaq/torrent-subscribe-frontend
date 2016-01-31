'use strict';

describe('Controller: ClientCtrl', function () {

  // load the controller's module
  beforeEach(module('torrentSubscribeFrontendApp'));

  var ClientCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClientCtrl = $controller('ClientCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
