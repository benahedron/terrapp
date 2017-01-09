'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './adminSeasons.routes';

export class AdminSeasonsComponent {
  seasons: Object[];
  $http: ng.IHttpService;
  getDateForInterval: Function;
  activeSeason: string;
  OptionsService: Object;

  /*@ngInject*/
  constructor($http, SeasonUtils, OptionsService) {
    this.$http = $http;
    this.getDateForInterval = SeasonUtils.getDateForInterval;
    this.OptionsService = OptionsService;
    this.reload();
  }

  private isActive(season) {
    let seasonToTest = '';
    if (season) {
      seasonToTest += season._id;
    }
    return seasonToTest === this.activeSeason;
  }

  private setActive(season){
    this.OptionsService.setActiveSeason(season)
    this.reload();
  }

  private reload() {
    this.OptionsService.getActiveSeason()
    .then((activeSeason) => {
      this.activeSeason = activeSeason;
    })
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
