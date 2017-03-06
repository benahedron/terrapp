'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './adminBackup.routes';
import {ModalBase} from '../shared/modal.base';

export class AdminBackupComponent extends ModalBase{
  $http: ng.IHttpService;
  $state: ng.ui.IStateService;

  /*@ngInject*/
  constructor($http, $state, $uibModal) {
    super($uibModal);
    this.$http = $http;
    this.$state = $state;
  }

  create() {
    this.$http.get('/api/options/backup', {responseType:'blob'})
    .then((res) => {
      // TODO: Figure out a proper way to do this.
      var anchor = document.createElement("a");
      document.body.appendChild(anchor);
      anchor.style = "display: none";
      var blob = new Blob([res.data], {type: "application/zip" });
      var objectUrl = URL.createObjectURL(blob);
      anchor.href = objectUrl;
      anchor.download = 'backup-terrapp-' + new Date().toString() + '.zip';
      anchor.click();
      window.URL.revokeObjectURL(objectUrl);
    });
  }

  restore() {
    let scope = this;
    this.modal('adminBackupRestore', null, () => {
      scope.$state.go('logout');
    });
  }

}

export default angular.module('terrappApp.adminBackup', [uiRouter])
  .config(routes)
  .component('adminBackup', {
    template: require('./adminBackup.html'),
    controller: AdminBackupComponent,
    controllerAs: '$ctrl'
  })
  .name;
