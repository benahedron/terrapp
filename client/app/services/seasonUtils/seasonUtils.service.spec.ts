'use strict';

describe('Service: seasonUtils', function() {
  // load the service's module
  beforeEach(module('terrappApp.seasonUtils'));

  // instantiate service
  var seasonUtils;
  beforeEach(inject(function(_seasonUtils_) {
    seasonUtils = _seasonUtils_;
  }));

  it('should do something', function() {
    expect(!!seasonUtils).toBe(true);
  });
});
