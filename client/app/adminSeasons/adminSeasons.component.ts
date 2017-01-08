'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './adminSeasons.routes';

export class AdminSeasonsComponent {
  seasons: Object[];
  $http: ng.IHttpService;
  getDateForInterval: Function;

  /*@ngInject*/
  constructor($http, SeasonUtils) {
    this.$http = $http;
    this.getDateForInterval = SeasonUtils.getDateForInterval;
    this.reload();
  }

  private reload() {
    this.$http.get("/api/seasons")
    .then((res) => {
      this.seasons = res.data;
    });
  }
}

export default angular.module('terrappApp.adminSeasons', [uiRouter])
  .config(routes)
  .component('adminSeasons', {
    template: require('./adminSeasons.html'),
    controller: AdminSeasonsComponent,
    controllerAs: '$ctrl'
  })
  .name;
