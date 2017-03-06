'use strict';

describe('Component: AdminBackupComponent', function() {
  // load the controller's module
  beforeEach(module('terrappApp.adminBackup'));

  var AdminBackupComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AdminBackupComponent = $componentController('adminBackup', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
