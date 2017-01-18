'use strict';

describe('Directive: pickupOptionMap', function() {
  // load the directive's module and view
  beforeEach(module('terrappApp.pickupOptionMap'));
  beforeEach(module('app/directives/pickupOptionMap/pickupOptionMap.html'));

  var element, scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<pickup-option-map></pickup-option-map>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the pickupOptionMap directive');
  }));
});
