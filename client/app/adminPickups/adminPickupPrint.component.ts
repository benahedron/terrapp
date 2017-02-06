'use strict';

const angular = require('angular');
import {AdminPickupBase} from './adminPickupBase'

export class AdminPickupPrintComponent extends AdminPickupBase{

  /*ngInjector*/
  constructor($http, PickupUtils, PickupOptionsService) {
    super($http, PickupUtils, PickupOptionsService)
  }

  /*window*/
  print() {
    window.print();
  }

}


export default angular.module('terrappApp.adminPickups')
  .component('adminPickupPrint', {
    template: require('./adminPickupPrint.html'),
    controller: AdminPickupPrintComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  }).name;
