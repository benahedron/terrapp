'use strict';

describe('Service: pickupUtils', function() {
  // load the service's module
  beforeEach(module('terrappApp.utils'));

  // instantiate service
  var pickupUtils;
  beforeEach(inject(function(_pickupUtils_) {
    pickupUtils = _pickupUtils_;
  }));

  it('should do something', function() {
    expect(!!pickupUtils).toBe(true);
  });
});
