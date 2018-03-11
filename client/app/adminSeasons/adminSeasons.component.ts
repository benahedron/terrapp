'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './adminSeasons.routes';
import {ModalBase} from '../shared/modal.base';

export class AdminSeasonsComponent extends ModalBase{
  seasons: Object[];
  $http: ng.IHttpService;
  getDateForInterval: Function;
  activeSeason: string;
  OptionsService: IOptionsService;
  $state: ng.ui.IStateService;

  /*@ngInject*/
  constructor($http, SeasonUtils, OptionsService, $uibModal, $state) {
    super($uibModal);
    this.$state = $state;
    this.$http = $http;
    this.getDateForInterval = SeasonUtils.getDateForInterval;
    this.OptionsService = OptionsService;
    this.reload();
  }

  getResolve(season) {
    return {
      season: function () {
        return season;
      }
    }
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
      this.seasons = res.data as ISeason[];
    });
  }

  delete(season) {
    let scope = this;
    this.modal('adminSeasonDelete', this.getResolve(season), (season) => {
      scope.seasons.splice(scope.seasons.indexOf(season), 1);
    });
  }

  edit(season) {
    this.modal('adminSeasonEdit', this.getResolve(season), (editedSeason) => {
      _.assign(season, editedSeason);
    });
  }

  create() {
    let scope = this;
    this.modal('adminSeasonEdit', this.getResolve(null), (season) => {
      scope.seasons.push(season);
    });
  }

  managePickups(season) {
    this.$state.go('adminPickups', {seasonId: season._id});
  }

  manageBaskets(season) {
    let scope = this;
    this.modal('adminSeasonBaskets', this.getResolve(season), (season) => {
    });
  }

  manageExtras(season) {
    let scope = this;
    this.modal('adminSeasonExtras', this.getResolve(season), () => {}).catch(()=> {
      this.reload();
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
