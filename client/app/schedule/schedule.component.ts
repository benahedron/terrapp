'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './schedule.routes';

export class ScheduleComponent {
  $http: Object;
  PickupOptionsService: Object;
  pickupOptions: Object[];
  userData: Object;

  /*@ngInject*/
  constructor($http, PickupOptionsService) {
    this.$http = $http;
    this.PickupOptionsService = PickupOptionsService;
  }

  $onInit() {
    let scope = this;
    this.PickupOptionsService.get()
    .then(pickupOptions => {
      this.pickupOptions = pickupOptions
      this.$http.get('/api/baskets/user')
      .then(res => {
        scope.userData = res.data;
      });
    });
  }
}

export default angular.module('terrappApp.schedule', [uiRouter])
  .config(routes)
  .component('schedule', {
    template: require('./schedule.html'),
    controller: ScheduleComponent,
    controllerAs: '$ctrl'
  })
  .name;
