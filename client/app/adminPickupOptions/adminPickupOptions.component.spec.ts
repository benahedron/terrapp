'use strict';

describe('Component: AdminPickupOptionsComponent', function() {
  // load the controller's module
  beforeEach(module('terrappApp.adminPickupOptions'));

  var AdminPickupOptionsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AdminPickupOptionsComponent = $componentController('adminPickupOptions', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
