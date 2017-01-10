'use strict';
const angular = require('angular');


export class PickupOptionsService {
  promise: Object;
  PickupOption: Object;

  /*@ngInject*/
  constructor(PickupOption) {
    this.PickupOption = PickupOption;
    this.reload();
  }

  public reload() {
    this.promise = this.PickupOption.query();
    console.log(this.promise);
  }

  public get() {
    return this.promise.$promise;
  }
}
function PickupOptionResource($resource) {
  'ngInject';
  return $resource('/api/pickupOptions/', {}, {});
}

export default angular.module('terrappApp.PickupOptionsService', [])
  .factory('PickupOption', PickupOptionResource)
  .service('PickupOptionsService', PickupOptionsService)
  .name;
