'use strict';

const angular = require('angular');

export class PickupOptionMapWindowComponent{
  pickupOption: IPickupOption;

  constructor() {
  }

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

export default angular.module('terrappApp.pickupOptionMap')
  .component('pickupOptionMapWindow', {
    template: require('./pickupOptionMapWindow.html'),
    controller: PickupOptionMapWindowComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  })
  .name;
