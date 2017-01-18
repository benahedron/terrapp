'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './adminPickups.routes';


export class AdminPickupsComponent {
  $state: ng.IStateService;
  $http: ng.IHttpService;
  $uibModal: Object;
  seasons: Object[];
  pickupOptions: Object[];
  selectedSeason: Object = null;
  selectedPickupOption: Object = null;
  pickups: Object[];
  getStartDate: Function;
  getEndDate: Function;

  /*@ngInject*/
  constructor(PickupOptionsService, OptionsService, PickupUtils, $uibModal, $stateParams, $state, $http, Season) {
    this.$state = $state;
    this.$http = $http;
    this.PickupUtils = PickupUtils;
    this.$uibModal = $uibModal;

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
      if (_.has($stateParams, 'pickupOptionId') && $stateParams.pickupOptionId && $stateParams.pickupOptionId !== '') {
        scope.selectedPickupOption = _.find(scope.pickupOptions, (pickupOption) => {
          return pickupOption._id+'' === $stateParams.pickupOptionId;
        });
      } else if(scope.selectedSeason) {
        scope.selectedPickupOption = _.first(scope.selectedSeason.activePickupOptions);
      } else {
        scope.selectedPickupOption = null;
      }

      scope.loadPickups();
    });
  }

  private loadPickups() {
    let scope = this;
    if (this.selectedSeason && this.selectedPickupOption) {
      this.$http.get('/api/pickupEvents/' + this.selectedSeason._id + '/' + this.selectedPickupOption._id )
      .then(res => {
        scope.pickups = res.data;
      });
    }
  }

  public getAvailablePickupOptions() {
    if (!this.selectedSeason) {
      return [];
    } else {
      return _.union(this.selectedSeason.activePickupOptions, this.pickupOption);
    }
  }

  public selectPickupOption(pickupOption) {
    let season = '';
    if(this.selectedSeason) {
      season = this.selectedSeason._id;

    }
    this.$state.go('adminPickups', {seasonId: season, pickupOptionId: pickupOption._id});
  }

  public selectSeason(season) {
    let pickupOption = _.first(season.activePickupOptions);
    this.$state.go('adminPickups', {seasonId: season._id, pickupOptionId: pickupOption._id});
  }

  modal(pickup, component, successCallback) {
    let scope = this;
    var modalInstance = this.$uibModal.open({
        component: component,
        resolve: {
          season: function() {
            return scope.selectedSeason;
          }
          pickup: function () {
            return pickup;
          }
        }
    } as ng.ui.bootstrap.IModalSettings);

    let scope = this;
    modalInstance.result.then((editedPickup) => {
      successCallback(editedPickup);
    });
  }

  edit(pickup) {
    this.modal(pickup, 'adminPickupEdit', (editedPickup) => {
      _.assign(pickup, editedPickup);
    });
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
