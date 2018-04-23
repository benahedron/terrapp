'use strict';

const angular = require('angular');


export class AdminSeasonEditComponent {
  season: ISeason;
  errors = {};
  isNew: Boolean = false;
  submitted: Boolean = false;
  $http: ng.IHttpService;
  getDateForInterval: Function;
  pickupOptions: IPickupOption[];

  /*ngInjector*/
  constructor($http, SeasonUtils: ISeasonUtilsService, PickupOptionsService: IPickupOptionsService) {
    this.$http = $http;
    this.getDateForInterval = SeasonUtils.getDateForInterval;

    let scope = this;
    PickupOptionsService.get().then((pickupOptions) => {
      scope.pickupOptions = _.difference(pickupOptions, scope.season.activePickupOptions);
    });
  }

  $onInit() {
    let resolve = (this as any).resolve;
    if (_.has(resolve, 'season') && resolve.season !== null) {
      this.season = _.cloneDeep(resolve.season);
      this.isNew = false;
    } else {
      this.season = {
        firstEventDate: new Date(),
        eventIntervalInDays: 7,
        numberOfEvents: 52,
        activePickupOptions: []
      } as ISeason;
      this.isNew = true;
    }
  }

  addActivePickupOption(pickupOption) {
    this.season.activePickupOptions.push(pickupOption.toJSON());
  }

  getInactivePickupOptions() {
    return _.difference(this.pickupOptions, this.season.activePickupOptions);
  }

  removeActivePickupOption(pickupOption) {
    this.season.activePickupOptions = _.without(this.season.activePickupOptions, pickupOption);
  }

  save(form) {
    this.submitted = true;
    if (form.$valid) {
      let method = this.$http.patch;
      let path = '';
      if (this.isNew) {
        method = this.$http.post;
      } else {
        path += this.season._id;
      }

      method('/api/seasons/' + path, this.season)
        .then((result) => {
          this.season = result.data as ISeason;
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
  }

  ok() {
    (this as any).resolve.season = this.season;
    (this as any).close({ $value: this.season });
  };

  cancel() {
    (this as any).dismiss({ $value: 'cancel' });
  };
}


export default angular.module('terrappApp.adminSeasons')
  .component('adminSeasonEdit', {
    template: require('./adminSeasonEdit.html'),
    controller: AdminSeasonEditComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  }).name;
