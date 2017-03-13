'use strict';

const angular = require('angular');


export class AdminBackupRestoreComponent{
  $scope: ng.IScope;
  $http: ng.IHttpService;
  Upload: any;
  file: any;


  /*ngInjector*/
  constructor($http, Upload, $scope) {
    this.$http = $http;
    this.$scope = $scope;
    this.Upload = Upload;
  }

  $onInit() {
  }


  save(form) {
    this.Upload.upload({url: '/api/options/restore', data: {file: (this.$scope as any).file}})
    .then((result) => {
      this.ok();
    })
    .catch(err => {
      /// Ignore
    });
  }

  ok() {
    (this as any).close({$value: 'ok'});
  };

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };
}


export default angular.module('terrappApp.adminBackup')
  .component('adminBackupRestore', {
    template: require('./adminBackupRestore.html'),
    controller: AdminBackupRestoreComponent,
    controllerAs: '$ctrl',
    bindings: {
      close: '&',
      dismiss: '&'
    },
  }).name;
