'use strict';

const angular = require('angular');

export class AdminExtraEventDeleteComponent{
  extraEvent: IExtraEvent;
  $http: ng.IHttpService;

  /*ngInjector*/
  constructor($http)
  {
    this.$http = $http;
  }

  $onInit() {
    this.extraEvent = (this as any).resolve.extraEvent;
  }

  ok() {
    this.$http.delete('/api/extraEvents/'+(this.extraEvent as any)._id)
    .then(() => {
      (this as any).close({$value: this.extraEvent});
    })

  };

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };
}


export default angular.module('terrappApp.adminExtraEvents')
  .component('adminExtraEventDelete', {
    template: require('./adminExtraEventDelete.html'),
    controller: AdminExtraEventDeleteComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  }).name;
