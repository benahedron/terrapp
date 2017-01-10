'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './adminPickupOptions.routes';


export class AdminPickupOptionsComponent {
  $http: ng.IHttpService;
  $uibModal: ng.ui.bootstrap.IModalService;
  pickupOptions: Object[] = [];
  PickupOptionsService: Object;

  /*@ngInject*/
  constructor($http, $uibModal, PickupOptionsService) {
    this.$http = $http;
    this.$uibModal = $uibModal;
    this.PickupOptionsService = PickupOptionsService;
    this.reload();
  }

  delete(pickupOption) {
    var modalInstance = this.$uibModal.open({
        component: 'adminPickupOptionDelete',
        resolve: {
          pickupOption: function () {
            return pickupOption;
          }
        }
      } as ng.ui.bootstrap.IModalSettings
    );

    let scope = this;
    modalInstance.result.then((pickupOption) => {
      scope.$http.delete("/api/pickupOptions/"+pickupOption._id)
      .then(() => {
        (scope.PickupOptionsService as any).reload();
        scope.reload();
      });
    }, function () {

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
