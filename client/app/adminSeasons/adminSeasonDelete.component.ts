'use strict';

const angular = require('angular');

export class AdminSeasonDeleteComponent{
  season: ISeason;
  $http: ng.IHttpService;

  /*ngInjector*/
  constructor($http)
  {
    this.$http = $http;
  }

  $onInit() {
    this.season = (this as any).resolve.season;
  }

  ok() {
    this.$http.delete('/api/seasons/'+this.season._id)
    .then(() => {
      (this as any).close({$value: this.season});
    })

  };

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };
}


export default angular.module('terrappApp.adminMembers')
  .component('adminSeasonDelete', {
    template: require('./adminSeasonDelete.html'),
    controller: AdminSeasonDeleteComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  }).name;
