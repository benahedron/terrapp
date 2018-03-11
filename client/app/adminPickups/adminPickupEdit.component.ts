'use strict';

const angular = require('angular');

export class AdminPickupEditComponent {
  nonModifiedPickup: IPickupEvent;
  pickup: IPickupEvent;

  errors = {};
  submitted: boolean = false;
  $http: ng.IHttpService;
  pickupOptions: IPickupOption[];
  dateOptions: Object;

  startDateOverride: Date = new Date();
  pickupOptionOverride:  IPickupOption;
  durationOverride: number;
  adminNote: string;
  availableExtras: Array<any>;

  PickupUtils: IPickupUtilsService;
  PickupOptionsService: IPickupOptionsService;
  season: ISeason;

  /*ngInjector*/
  constructor($http, PickupUtils, PickupOptionsService) {
    this.$http = $http;
    this.PickupUtils = PickupUtils;
    this.PickupOptionsService = PickupOptionsService;
  }

  $onInit() {
    let resolve = (this as any).resolve;
    if (_.has(resolve, 'pickup') && resolve.pickup !== null) {

      /// Clone the current version but omit all override options
      this.nonModifiedPickup = _.cloneDeep(resolve.pickup);
      this.nonModifiedPickup.pickupOptionOverride = null;
      this.nonModifiedPickup.startDateOverride = null;
      this.nonModifiedPickup.durationMinutesOverride = null;

      this.pickup = _.cloneDeep(resolve.pickup);
      this.season = resolve.season as ISeason;
      let scope = this;
      this.PickupOptionsService.get().then((pickupOptions) => {
        scope.pickupOptions = scope.season.activePickupOptions;
        scope.reinit();
      });
    } else {
      this.cancel();
    }
  }

  private reinit() {
    this.startDateOverride = this.PickupUtils.getStartDateFor(this.season, this.getPickupOption(this.nonModifiedPickup), this.pickup);
    this.dateOptions = {minDate: this.getMinDate(), maxDate: this.getMaxDate()};
    this.durationOverride = this.pickup.durationMinutesOverride || this.getPickupOption(this.nonModifiedPickup).durationMinutes;
    this.adminNote = this.pickup.adminNote;
    this.availableExtras = _.cloneDeep(this.pickup.availableExtras);
    this.update();
  }

  reset () {
    this.pickup = _.cloneDeep(this.nonModifiedPickup);
    this.reinit();
  }

  update() {

    let defaultDuration = this.getPickupOption(this.nonModifiedPickup).durationMinutes;
    if (this.durationOverride && this.durationOverride!=defaultDuration) {
      this.pickup.durationMinutesOverride = this.durationOverride;
    } else {
      this.pickup.durationMinutesOverride = null;
    }

    let defaultDate = this.PickupUtils.getStartDateFor(this.season, this.getPickupOption(this.nonModifiedPickup), this.nonModifiedPickup);
    if (this.startDateOverride && (defaultDate.getTime() !== this.startDateOverride.getTime())) {
      this.pickup.startDateOverride = this.startDateOverride+'';
    } else {
      this.pickup.startDateOverride = null;
    }

    if (this.pickup.pickupOptionOverride) {
      this.pickupOptionOverride = this.getPickupOption(this.pickup);
    } else {
      this.pickupOptionOverride = null;
    }

    this.pickup.availableExtras = this.availableExtras;

    this.pickup.adminNote = this.adminNote;
  }

  selectPickupOption(pickupOption) {
    this.pickupOptionOverride = pickupOption;
    if (pickupOption && (pickupOption._id !== this.pickup.pickupOption)) {
      this.pickup.pickupOptionOverride = pickupOption._id;
    } else {
      this.pickup.pickupOptionOverride = null;
    }
    this.update();
  }

  getPickupOption(pickup) {
    let actualOption = pickup.pickupOptionOverride || pickup.pickupOption;
    return _.find(this.pickupOptions, option => {
      return option._id+'' === actualOption+'';
    });
  }

  getDaysDifference(day1, day2) {
    return Math.floor(day2.getTime()/(24*60*60000))
          -Math.floor(day1.getTime()/(24*60*60000));
  }

  getCurrentPickupOptionId() {
    let option = this.getPickupOption(this.pickup);
    if (option) {
      return option._id+'';
    } else {
      return '';
    }
  }

  getCurrentStartDate() {
    let actualOption = this.getPickupOption(this.nonModifiedPickup);
    return this.PickupUtils.getStartDateFor(this.season, actualOption, this.pickup);
  }

  getCurrentEndDate() {
    let actualOption = this.getPickupOption(this.nonModifiedPickup);
    return this.PickupUtils.getEndDateFor(this.season, actualOption, this.pickup);
  }

  getMinDate() {
    let actualOption = this.getPickupOption(this.nonModifiedPickup);
    let minTimestamp = this.PickupUtils.getStartDateFor(this.season, actualOption, this.nonModifiedPickup).getTime();
    minTimestamp -= (this.season.eventIntervalInDays-1) * 24 * 60 * 60000;
    return new Date(minTimestamp);
  }

  getMaxDate() {
    let actualOption = this.getPickupOption(this.nonModifiedPickup);
    let maxTimestamp = this.PickupUtils.getStartDateFor(this.season, actualOption, this.nonModifiedPickup).getTime();
    maxTimestamp += (this.season.eventIntervalInDays-1) * 24 * 60 * 60000;
    return new Date(maxTimestamp);
  }

  hasPickupExtra(extra) {
    let match = _.find(this.availableExtras, candidate => {
      if (typeof candidate == "string" && extra._id){
        return extra._id == candidate;
      } else {
        return extra._id == candidate._id;
      }
    });
    return (match != null);
  }

  changeExtraToPickup(extra) {
    if (this.hasPickupExtra(extra)) {
      this.availableExtras = _.without(this.availableExtras, extra);
    } else {
      this.availableExtras.push(extra);
    }
    this.update();
  }

  save(form) {
    this.submitted = true;
    if(form.$valid) {
      this.$http.put('/api/pickupEvents/'+this.pickup._id,this.pickup)
      .then((result) => {
        this.pickup = result.data as IPickupEvent;
        this.ok();
      })
      .catch(err => {
        err = err.data;
        this.errors = {};
        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, (error, field) => {
          form[field].$setValidity('mongoose', false);
          this.errors[field] = error.message;
        });

      });
    }
  };

  ok() {
    (this as any).resolve.pickupEvent = this.pickup;
    (this as any).close({$value: this.pickup});
  };

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };
}


export default angular.module('terrappApp.adminPickups')
  .component('adminPickupEdit', {
    template: require('./adminPickupEdit.html'),
    controller: AdminPickupEditComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  }).name;
