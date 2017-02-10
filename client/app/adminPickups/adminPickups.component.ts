'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './adminPickups.routes';
import {ModalBase} from '../shared/modal.base';

export class AdminPickupsComponent extends ModalBase{
  $state: ng.ui.IStateService;
  $http: ng.IHttpService;
  seasons: ISeason[];
  availablePickupOptions: IPickupOption[];
  availableIntervals: any[];
  selectedSeason: ISeason = null;
  selectedPickupOption: IPickupOption = null;
  selectedInterval: any = null;
  pickups: IPickupEvent[];
  getStartDate: Function;
  getEndDate: Function;
  $stateParams: any;
  PickupUtils: IPickupUtilsService;

  /*@ngInject*/
  constructor(PickupOptionsService: IPickupOptionsService, OptionsService, PickupUtils, $uibModal, $stateParams, $state, $http, Season) {
    super($uibModal);
    this.$state = $state;
    this.$http = $http;
    this.PickupUtils = PickupUtils;
    this.$stateParams = $stateParams;
    let scope = this;
    if ($stateParams.seasonId === '') {
      OptionsService.getActiveSeason().
      then((activeSeasonId) => {
        scope.$state.go('adminPickups', {seasonId: activeSeasonId, pickupOption:null, interval:0});
      });
    } else {
      scope.applySeason(Season, () =>{
        scope.applyPickupOption(PickupOptionsService, () =>{
          scope.applyInterval( () =>{
            scope.loadPickups();
          });
        });
      });
    }
  }

  private applySeason(Season, callback) {
    let scope = this;
    Season.query((seasons) => {
      scope.seasons = seasons;
      scope.selectedSeason = _.find(scope.seasons, (season) => {
        return season._id+'' === scope.$stateParams.seasonId+'';
      });
      callback();
    });
  }

  private applyPickupOption(PickupOptionsService: IPickupOptionsService, callback) {
    let scope = this;
    if (!scope.selectedSeason) {
      return;
    }
    PickupOptionsService.get().then((pickupOptions) => {
      scope.availablePickupOptions = scope.selectedSeason.activePickupOptions;
      if (scope.$stateParams.pickupOption && scope.$stateParams.pickupOption !== '') {
        scope.selectedPickupOption = _.find(scope.availablePickupOptions, (pickupOption) => {
          return pickupOption._id+'' === scope.$stateParams.pickupOption;
        });
      } else {
        scope.selectedPickupOption = null;
      }
      callback();
    });
  }

  private applyInterval(callback) {
    this.availableIntervals = [];
    let now = new Date().getTime();
    let bestCandidate = null;
    for (let i = 0;i < this.selectedSeason.numberOfEvents; ++i) {
      let interval = {
        number: i+1,
        startDate: this.PickupUtils.getDateForInterval(this.selectedSeason, i)
      };
      this.availableIntervals.push(interval);
      if (interval.startDate.getTime()<=now) {
        bestCandidate = interval;
      }
    }

    if (this.$stateParams.interval && this.$stateParams.interval !== '' && this.$stateParams.interval>0 && this.$stateParams.interval <= this.availableIntervals.length) {
      this.selectedInterval = this.availableIntervals[this.$stateParams.interval-1];
    } else if (bestCandidate) {
      this.selectedInterval = this.availableIntervals[bestCandidate.number-1];
    } else {
      this.selectedInterval = null;
    }

    callback();
  }

  private loadPickups() {
    let scope = this;
    if (this.selectedSeason) {
      let option = null;
      let interval = null;
      if (this.selectedPickupOption) {
        option  =this.selectedPickupOption._id;
      }
      if (this.selectedInterval) {
        interval = this.selectedInterval.number;
      }
      this.$http.get('/api/pickupEvents/' + this.selectedSeason._id + '/' + option + '/' + interval )
      .then(res => {
        scope.pickups = res.data as IPickupEvent[];
        scope.evaluatePickups();
      });
    }
  }

  private evaluatePickups(){
    let scope = this;
    // Calculate date & sort
    scope.pickups = _.sortBy(scope.pickups, pickup => {
      let actualOption = pickup.pickupOption;
      actualOption = _.find(scope.availablePickupOptions, option => {
        return option._id+'' === actualOption+'';
      });
      (pickup as any).effectiveStart = scope.PickupUtils.getStartDateFor(scope.selectedSeason, actualOption, pickup);
      (pickup as any).effectiveEnd = scope.PickupUtils.getEndDateFor(scope.selectedSeason, actualOption, pickup);
      return (pickup as any).effectiveStart.getTime();
    });
  }

  public getAvailablePickupOptions() {
    return this.availablePickupOptions;
  }

  public getAvailableIntervals() {
    return this.availableIntervals;
  }

  public selectPickupOption(pickupOption) {
    let interval = '';
    if(this.selectedInterval) {
      interval = this.selectedInterval.number;
    }
    let pickupOptionId = null;
    if (pickupOption) {
      pickupOptionId = pickupOption._id;
    }
    this.$state.go('adminPickups', {seasonId: this.selectedSeason._id, pickupOption: pickupOptionId, interval: interval});
  }

  public selectSeason(season) {
    this.$state.go('adminPickups', {seasonId: season._id, pickupOption: null, interval: 0});
  }

  public selectInterval(interval) {
    let selectedPickupOption = null;
    if(this.selectedPickupOption) {
      selectedPickupOption = this.selectedPickupOption._id;
    }
    let intervalNumber = 0;
    if(interval){
      intervalNumber = interval.number;
    }
    this.$state.go('adminPickups', {seasonId: this.selectedSeason._id, pickupOption: selectedPickupOption, interval: intervalNumber});
  }

  getResolve(pickup): Object{
    let scope = this;
    return {
      season: function() {
        return scope.selectedSeason;
      },
      pickup: function () {
        return pickup;
      }
    }
  }

  edit(pickup) {
    this.modal('adminPickupEdit', this.getResolve(pickup), editedPickup => {
      _.assign(pickup, editedPickup);
      this.evaluatePickups();
    });
  }

  manage(pickup) {
    this.modal('adminPickupManage', this.getResolve(pickup), () => {});
  }

  print(pickup) {
    this.modal('adminPickupPrint', this.getResolve(pickup), () => {}, {windowClass: 'widePrintableArea'});
  }

  mail(pickup) {
    this.modal('adminPickupMail', this.getResolve(pickup), editedPickup => {
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
