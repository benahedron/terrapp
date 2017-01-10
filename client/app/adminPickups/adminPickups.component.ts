'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './adminPickups.routes';


export class AdminPickupsComponent {
  $state: ng.IStateService;
  $http: ng.IHttpService;
  seasons: Object[];
  pickupOptions: Object[];
  selectedSeason: Object = null;
  selectedPickupOption: Object = null;
  pickups: Object[];

  /*@ngInject*/
  constructor(PickupOptionsService, OptionsService, $stateParams, $state, $http;, Season) {
    this.$state = $state;
    this.$http = $http;
    let scope = this;
    if ($stateParams.seasonId === '') {
      OptionsService.getActiveSeason().
      then((activeSeasonId) => {
        scope.$state.go('adminPickups', {seasonId: activeSeasonId});
      });
    }
    scope.applySeason($stateParams, Season, PickupOptionsService);
  }

  private applySeason($stateParams, Season, PickupOptionsService) {
    let scope = this;
    Season.query((seasons) => {
      scope.seasons = seasons;

      if ($stateParams.seasonId !== '') {
        scope.selectedSeason = _.find(scope.seasons, (season) => {
          return season._id+'' === $stateParams.seasonId;
        });
      } else {
        scope.selectedSeason = _.first(seasons);
      }
      scope.applyPickupOption($stateParams, PickupOptionsService);
    });
  }

  private applyPickupOption($stateParams, PickupOptionsService) {
    let scope = this;

    PickupOptionsService.get().then((pickupOptions) => {
      scope.pickupOptions = pickupOptions;

      if ($stateParams.pickupOptionId !== '') {
        scope.selectedPickupOption = _.find(scope.pickupOptions, (pickupOption) => {
          return pickupOption._id+'' === $stateParams.pickupOptionId;
        });
      } else {
        scope.selectedPickupOption = _.first(seaons);
      }
      scope.loadPickups();
    }
  }

  private loadPickups() {
    this.pickups = this.$http.get(
      '/api/pickupEvents/' + this.selectedSeason._id +
      '/' + this.selectedPickupOption._id );

  }

  public selectPickupOption(pickupOption) {
    let season = '';
    if(this.selectSeason) {
      season = this.selectSeason._id
    }
    this.$state.go('adminPickups', {seasonId: season, pickupOptionId: pickupOption._id});
  }

  public selectSeason(season) {
    let pickupOption = '';
    if(this.selectedPickupOption) {
      pickupOption = this.selectedPickupOption._id
    }
    this.$state.go('adminPickups', {seasonId: season._id, pickupOptionId: pickupOption});
  }
}

export default angular.module('terrappApp.adminPickups', [uiRouter])
  .config(routes)
  .component('adminPickups', {
    template: require('./adminPickups.html'),
    controller: AdminPickupsComponent,
    controllerAs: '$ctrl'
  })
  .name;
