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
  $uibModal: ng.ui.bootstrap.IModalService;
  $state: ng.IStateService;

  /*@ngInject*/
  constructor($http, SeasonUtils, OptionsService, $uibModal, $state) {
    this.$state = $state;
    this.$uibModal = $uibModal;
    this.$http = $http;
    this.getDateForInterval = SeasonUtils.getDateForInterval;
    this.OptionsService = OptionsService;
    this.reload();
  }

  modal(season, component, successCallback) {
    var modalInstance = this.$uibModal.open({
        component: component,
        resolve: {
          season: function () {
            return season;
          }
        }
    } as ng.ui.bootstrap.IModalSettings);

    let scope = this;
    modalInstance.result.then((editedSeason) => {
      successCallback(editedSeason);
    });
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
    .then(() => {
      this.reload();
    });
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

  delete(season) {
    let scope = this;
    this.modal(season, 'adminSeasonDelete', (season) => {
      scope.seasons.splice(scope.seasons.indexOf(season), 1);
    });
  }

  edit(season) {
    this.modal(season, 'adminSeasonEdit', (editedSeason) => {
      _.assign(season, editedSeason);
    });
  }

  create() {
    let scope = this;
    this.modal(null, 'adminSeasonEdit', (season) => {
      scope.seasons.push(season);
    });
  }

  manage(season) {
    this.$state.go('adminPickups', {seasonId: season._id});
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
