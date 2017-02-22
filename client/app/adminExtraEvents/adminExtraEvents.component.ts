'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './adminExtraEvents.routes';
import {ModalBase} from '../shared/modal.base';

export class AdminExtraEventsComponent extends ModalBase{
  extraEvents: Object[];
  $http: ng.IHttpService;
  OptionsService: IOptionsService;
  $state: ng.ui.IStateService;
  $stateParams: any;
  seasons: ISeason[];
  selectedSeason: ISeason;

  /*@ngInject*/
  constructor($http, $state, $stateParams, Season, OptionsService, $uibModal) {
    super($uibModal);
    this.$http = $http;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.OptionsService = OptionsService;

    this.applySeason(Season, () => {
      this.reload();
    });
  }

  private applySeason(Season, callback) {
    let scope = this;
    Season.query((seasons) => {
      scope.seasons = seasons;
      if (_.has(scope.$stateParams, 'seasonId')) {
        scope.selectedSeason = _.find(scope.seasons, (season) => {
          return season._id+'' === scope.$stateParams.seasonId+'';
        });
        if (scope.selectedSeason) {
          return callback();
        }
      }

      scope.OptionsService.getActiveSeason()
      .then((activeSeason) => {
        scope.$state.go('adminExtraEvents', {seasonId: activeSeason});
      });
    });
  }

  getResolve(extraEvent) {
    let scope = this;
    return {
      extraEvent: function () {
        return extraEvent;
      },
      season: function() {
        return scope.selectedSeason;
      }
    }
  }

  private reload() {
    this.$http.get("/api/extraEvents/"+this.selectedSeason._id)
    .then((res) => {
      this.extraEvents = res.data as IExtraEvent[];
    });
  }

  public selectSeason(season) {
    this.$state.go('adminExtraEvents', {seasonId: season._id});
  }

  delete(extraEvent) {
    let scope = this;
    this.modal('adminExtraEventDelete', this.getResolve(extraEvent), (extraEvent) => {
      scope.extraEvents.splice(scope.extraEvents.indexOf(extraEvent), 1);
    });
  }

  edit(extraEvent) {
    this.modal('adminExtraEventEdit', this.getResolve(extraEvent), (editedExtraEvent) => {
      _.assign(extraEvent, editedExtraEvent);
    });
  }

  create() {
    let scope = this;
    this.modal('adminExtraEventEdit', this.getResolve(null), (extraEvent) => {
      scope.extraEvents.push(extraEvent);
    });
  }

}

export default angular.module('terrappApp.adminExtraEvents', [uiRouter])
  .config(routes)
  .component('adminExtraEvents', {
    template: require('./adminExtraEvents.html'),
    controller: AdminExtraEventsComponent,
    controllerAs: '$ctrl'
  })
  .name;
