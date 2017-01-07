'use strict';
const angular = require('angular');

/*@ngInject*/
export function pickupOptionsService() {
	// AngularJS will instantiate a singleton by calling "new" on this function
}

export default angular.module('terrappApp.pickupOptions', [])
  .service('pickupOptions', pickupOptionsService)
  .name;
