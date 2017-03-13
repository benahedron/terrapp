'use strict';

const angular = require('angular');


export class AdminExtraEventEditComponent{
  season: ISeason;
  extraEvent: IExtraEvent;
  errors = {};
  isNew: Boolean = false;
  submitted: Boolean = false;
  $http: ng.IHttpService;
  pickupOptions: IPickupOption[];
  PickupOptionsService: IPickupOptionsService;

  /*ngInjector*/
  constructor($http, PickupOptionsService: IPickupOptionsService) {
    this.$http = $http;
    this.PickupOptionsService = PickupOptionsService;
  }

  $onInit() {
    let resolve = (this as any).resolve;
    this.PickupOptionsService.get().then((pickupOptions) => {
      this.pickupOptions = pickupOptions;
      if (_.has(resolve, 'season') && resolve.season !== null) {
        this.season = resolve.season;
      } else {
        this.cancel();
      }

      if (_.has(resolve, 'extraEvent') && resolve.extraEvent !== null) {
        this.extraEvent = _.cloneDeep(resolve.extraEvent);
        this.isNew = false;
      } else {
        this.extraEvent = {
          title: '',
          date: new Date(),
          location: _.first(this.pickupOptions)._id+'' as any,
          description: '',
          durationMinutes: 60,
          season: this.season
        } as IExtraEvent;
        this.isNew = true;
      }
    });
  }

  save(form) {
    this.submitted = true;
    if(form.$valid) {
      let method = this.$http.patch;
      let path = '';
      if (this.isNew) {
        method = this.$http.post;
      } else {
        path += (this.extraEvent as any)._id;
      }

      method('/api/extraEvents/'+path, this.extraEvent)
      .then((result) => {
        this.extraEvent = result.data as IExtraEvent;
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
    (this as any).resolve.extraEvent = this.extraEvent;
    (this as any).close({$value: this.extraEvent});
  };

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };
}


export default angular.module('terrappApp.adminExtraEvents')
  .component('adminExtraEventEdit', {
    template: require('./adminExtraEventEdit.html'),
    controller: AdminExtraEventEditComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  }).name;
