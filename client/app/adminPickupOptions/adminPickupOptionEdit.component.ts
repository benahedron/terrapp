'use strict';

const angular = require('angular');

export class AdminPickupOptionEditComponent{
  pickupOption: IPickupOption;
  errors = {};
  isNew: Boolean = false;
  submitted: Boolean = false;
  $http: ng.IHttpService;

  /*ngInjector*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    let resolve = (this as any).resolve;
    if (_.has(resolve, 'pickupOption') && resolve.pickupOption !== null) {
      this.pickupOption = _.cloneDeep(resolve.pickupOption);
      this.isNew = false;
    } else {
      this.pickupOption = {
        _id: null,
        name: '',
        geoUri: 'geo:49.63075,6.12240?z=17',
        weekDay: 2,
        startMinute: 9*60,
        durationMinutes: 60,
        active: true,
        hoursBeforeLocking: 12
      } as IPickupOption;
      this.isNew = true;
    }
  }

  save(form) {
    this.submitted = true;
    if(form.$valid) {
      let method = this.$http.patch;
      let path = '';
      if (this.isNew) {
        method = this.$http.post;
      } else {
        path += this.pickupOption._id;
      }

      method('/api/pickupOptions/'+path, this.pickupOption)
      .then((result) => {
        this.pickupOption = result.data as IPickupOption;
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
    (this as any).resolve.pickupOption = this.pickupOption;
    (this as any).close({$value: this.pickupOption});
  };

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };
}


export default angular.module('terrappApp.adminPickupOptions')
  .component('adminPickupOptionEdit', {
    template: require('./adminPickupOptionEdit.html'),
    controller: AdminPickupOptionEditComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  }).name;
