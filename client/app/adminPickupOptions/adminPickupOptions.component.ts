'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './adminPickupOptions.routes';
import {ModalBase} from '../shared/modal.base';


export class AdminPickupOptionsComponent extends ModalBase{
  $http: ng.IHttpService;
  $uibModal: ng.ui.bootstrap.IModalService;
  pickupOptions: Object[] = [];
  PickupOptionsService: Object;

  /*@ngInject*/
  constructor($http, $uibModal, PickupOptionsService) {
    super($uibModal);
    this.$http = $http;
    this.PickupOptionsService = PickupOptionsService;
    this.reload();
  }

  getResolve(pickupOption) {
    return {
      pickupOption: function () {
        return pickupOption;
      }
    };
  }

  delete(pickupOption) {
    let scope = this;
    this.modal('adminPickupOptionDelete', this.getResolve(pickupOption), (pickupOption) => {
      scope.$http.delete("/api/pickupOptions/"+pickupOption._id)
      .then(() => {
        (scope.PickupOptionsService as any).reload();
        scope.reload();
      });
    });
  }

  edit(pickupOption) {
    let scope = this;
    this.modal('adminPickupOptionEdit', this.getResolve(pickupOption), (pickupOption) => {
      (scope.PickupOptionsService as any).reload();
      scope.reload();
    });
  }

  create() {
    let scope = this;
    this.modal('adminPickupOptionEdit', this.getResolve(null), (pickupOption) => {
      (scope.PickupOptionsService as any).reload();
      scope.reload();
    });
  }

  reload() {
    (this.PickupOptionsService as any).get()
    .then(pickupOptions => {
      this.pickupOptions = pickupOptions;
    });
  }
}



export default angular.module('terrappApp.adminPickupOptions', [uiRouter])
  .config(routes)
  .component('adminPickupOptions', {
    template: require('./adminPickupOptions.html'),
    controller: AdminPickupOptionsComponent,
    controllerAs: '$ctrl'
  })
  .name;
