'use strict';

describe('Component: AdminExtraEventsComponent', function() {
  // load the controller's module
  beforeEach(module('terrappApp.adminExtraEvents'));

  var AdminExtraEventComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AdminExtraEventComponent = $componentController('adminExtraEvents', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
