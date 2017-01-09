'use strict';

describe('Service: OptionsService', function() {
  // load the service's module
  beforeEach(module('terrappApp.OptionsService'));

  // instantiate service
  var OptionsService;
  beforeEach(inject(function(_OptionsService_) {
    OptionsService = _OptionsService_;
  }));

  it('should do something', function() {
    expect(!!OptionsService).toBe(true);
  });
});
