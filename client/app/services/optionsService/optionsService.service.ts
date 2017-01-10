'use strict';
const angular = require('angular');

let ACTIVE_SEASON_FIELD = 'activeSeason';

export class OptionsService {
  $http: ng.IHttpService;
  activeDeferred: ng.IDeferred<any>;
  $q: ng.IQService;

  /*@ngInject*/
  constructor($http, $q: ng.IQService) {
    this.$http = $http;
    this.$q = $q;
    this.activeDeferred = this.$q.defer();
    this.reload();
  }

  public reload() {
    this.$http.get("/api/options/"+ACTIVE_SEASON_FIELD)
    .then((res) => {
      this.activeDeferred.resolve(res.data);
    },() => {
      this.activeDeferred.reject();
    });
  }

  public getActiveSeason() {
    return this.activeDeferred.promise;
  }

  public setActiveSeason(season) {
    let activeSeasonId = '';
    if (season) {
      activeSeasonId = season._id;
    }

    this.activeDeferred = this.$q.defer();
    return this.$http.post("/api/options/"+ACTIVE_SEASON_FIELD, {value: activeSeasonId})
    .then(() => {
      this.reload();
    });
  }
}

export default angular.module('terrappApp.OptionsService', [])
  .service('OptionsService', OptionsService)
  .name;
