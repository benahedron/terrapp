'use strict';

describe('Service: PickupOptionsService', function() {
  // load the service's module
  beforeEach(module('terrappApp.PickupOptionsService'));

  // instantiate service
  var PickupOptionsService;
  beforeEach(inject(function(_PickupOptionsService_) {
    PickupOptionsService = _PickupOptionsService_;
  }));

  it('should do something', function() {
    expect(!!PickupOptionsService).toBe(true);
  });
});
