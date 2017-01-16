'use strict';

const angular = require('angular');

export class AdminPickupEditComponent {
  nonModifiedPickup: Pickup;
  pickup: Pickup;

  errors = {};
  submitted: Boolean = false;
  $http: ng.IHttpService;
  pickupOptions: Object[];
  dateOptions: Object;

  startDateOverride: Date = new Date();
  pickupOptionOverride:  Object;
  durrationOverride: Number;


  /*ngInjector*/
  constructor($http, PickupUtils, PickupOptionsService) {
    this.$http = $http;
    this.PickupUtils = PickupUtils;

    let scope = this;
    PickupOptionsService.get().then((pickupOptions) => {
      scope.pickupOptions = pickupOptions;
    });
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
      this.season = resolve.season;
      this.pickupOptions = _.union(this.pickupOptions, this.season.activePickupOptions);
      this.startDateOverride = this.PickupUtils.getStartDateFor(this.season, this.getPickupOption(this.pickup), this.pickup)
      this.dateOptions = {minDate: this.getMinDate(), maxDate: this.getMaxDate()};
      this.durrationOverride = this.pickup.durationMinutesOverride || this.getPickupOption(this.nonModifiedPickup).durationMinutes;
      this.update();
    } else {
      this.cancel();
    }
  }

  update() {
    let defaultDuration = this.getPickupOption(this.nonModifiedPickup).durationMinutes;
    if (this.durrationOverride && this.durrationOverride!=defaultDuration) {
      this.pickup.durationMinutesOverride = this.durrationOverride;
    } else {
      this.pickup.durationMinutesOverride = null;
    }

    let defaultDate = this.PickupUtils.getStartDateFor(this.season, this.getPickupOption(this.nonModifiedPickup), this.nonModifiedPickup);
    if (defaultDate !== this.pickupOptionOverride) {
      this.pickup.startDateOverride = this.startDateOverride;
    } else {
      this.pickup.startDateOverride = null;
    }

    if (this.pickupOptionOverride) {
      this.pickup.pickupOptionOverride = this.pickupOptionOverride._id;
    } else {
      this.pickupOptionOverride = null;
    }
  }

  selectPickupOption(pickupOption) {
    this.pickupOptionOverride = pickupOption;
    this.update();
  }

  getPickupOption(pickup) {
    let actualOption = pickup.pickupOptionOverride || pickup.pickupOption;
    return _.find(this.pickupOptions, option => {
      return option._id+'' === actualOption;
    });
  }

  getDaysDifference(day1, day2) {
    return parseInt(day2.getTime()/(24*60*60000))
          -parseInt(day1.getTime()/(24*60*60000));
  }

  getCurrentStartDate() {
    let actualOption = this.getPickupOption(this.pickup);
    return this.PickupUtils.getStartDateFor(this.season, actualOption, this.pickup);
  }

  getCurrentEndDate() {
    let actualOption = this.getPickupOption(this.pickup);
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


  save(form) {
    this.submitted = true;
    if(form.$valid) {
      this.$http.put('/api/pickupEvents/'+this.pickup._id,this.pickup)
      .then((result) => {
        this.ok(result.data);
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
