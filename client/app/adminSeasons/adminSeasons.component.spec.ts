'use strict';

describe('Component: AdminSeasonsComponent', function() {
  // load the controller's module
  beforeEach(module('terrappApp.adminSeasons'));

  var AdminSeasonsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AdminSeasonsComponent = $componentController('adminSeasons', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
