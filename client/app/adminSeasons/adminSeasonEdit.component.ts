'use strict';

const angular = require('angular');

interface Season {
  name: string;
  firstEventDate: Date;
  eventIntervalInDays: Number;
  numberOfEvents: Number;
}

export class AdminSeasonEditComponent{
  season: Season;
  errors = {};
  isNew: Boolean = false;
  submitted: Boolean = false;
  $http: ng.IHttpService;
  getDateForInterval: Function;

  /*ngInjector*/
  constructor($http, SeasonUtils) {
    this.$http = $http;
    this.getDateForInterval = SeasonUtils.getDateForInterval;
  }

  $onInit() {
    let resolve = (this as any).resolve;
    if (_.has(resolve, 'season') && resolve.season !== null) {
      this.season = _.cloneDeep(resolve.season);
      this.isNew = false;
    } else {
      this.season = {
        eventIntervalInDays: 7,
        numberOfEvents: 52;
      };
      this.isNew = true;
    }
  }

  save(form) {
    this.submitted = true;
    if(form.$valid) {
      let method = this.$http.put;
      let path = '':
      if (this.isNew) {
        method = this.$http.post;
      } else {
        path += this.season._id;
      }

      method('/api/seasons/'+path, this.season)
      .then((result) => {
        this.ok(result);
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
    (this as any).close({$value: this.season});
  };

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
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
