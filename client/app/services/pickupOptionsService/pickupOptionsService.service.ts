'use strict';
const angular = require('angular');


export class PickupOptionsService {
  $http: ng.IHttpService;
  deferred: ng.IDeferred<any>;
  $q: ng.IQService;

  /*@ngInject*/
  constructor($http, $q: ng.IQService) {
    this.$http = $http;
    this.deferred = null;
    this.$q = $q;
    this.reload();
  }

  public reload() {
    this.deferred = this.$q.defer();
    this.$http.get("/api/pickupOptions")
    .then((res) => {
      this.deferred.resolve(res.data);
    },() => {
      this.deferred.reject();
    });
  }

  public get() {
    return this.deferred.promise;
  }
}

export default angular.module('terrappApp.PickupOptionsService', [])
  .service('PickupOptionsService', PickupOptionsService)
  .name;
