'use strict';

describe('Component: SeasonsComponent', function() {
  // load the controller's module
  beforeEach(module('terrappApp.seasons'));

  var SeasonsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    SeasonsComponent = $componentController('seasons', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
