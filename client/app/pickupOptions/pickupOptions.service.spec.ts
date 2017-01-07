'use strict';

describe('Service: pickupOptions', function() {
  // load the service's module
  beforeEach(module('terrappApp.pickupOptions'));

  // instantiate service
  var pickupOptions;
  beforeEach(inject(function(_pickupOptions_) {
    pickupOptions = _pickupOptions_;
  }));

  it('should do something', function() {
    expect(!!pickupOptions).toBe(true);
  });
});
