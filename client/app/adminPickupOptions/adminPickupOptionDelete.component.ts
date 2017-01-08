'use strict';

const angular = require('angular');

export class AdminPickupOptionDeleteComponent{
  pickupOption: Object;

  /*ngInjector*/
  $onInit() {
    this.pickupOption = (this as any).resolve.pickupOption;
  }

  ok() {
    (this as any).close({$value: this.pickupOption});
  };

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };
}


export default angular.module('terrappApp.adminPickupOptions')
  .component('adminPickupOptionDelete', {
    template: require('./adminPickupOptionDelete.html'),
    controller: AdminPickupOptionDeleteComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  }).name;
