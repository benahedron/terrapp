'use strict';

describe('Component: AdminMembersComponent', function() {
  // load the controller's module
  beforeEach(module('terrappApp.admin'));

  var AdminMembersComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AdminMembersComponent = $componentController('adminMembers', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
