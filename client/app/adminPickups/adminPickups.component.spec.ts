'use strict';

describe('Component: AdminPickupsComponent', function() {
  // load the controller's module
  beforeEach(module('terrappApp.adminPickups'));

  var AdminPickupsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AdminPickupsComponent = $componentController('adminPickups', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
