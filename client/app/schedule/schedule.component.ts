'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './schedule.routes';

export class ScheduleComponent {
  $http: Object;
  PickupOptionsService: Object;
  pickupOptions: Object[];
  userEvents = [];
  season: Object;
  PickupUtils: Object;

  /*@ngInject*/
  constructor($http, PickupOptionsService, PickupUtils) {
    this.$http = $http;
    this.PickupOptionsService = PickupOptionsService;
    this.PickupUtils = PickupUtils;
  }

  $onInit() {
    let scope = this;
    this.PickupOptionsService.get()
    .then(pickupOptions => {
      this.pickupOptions = pickupOptions
      this.$http.get('/api/baskets/user')
      .then(res => {
        scope.processBaskets(res.data.baskets);
        scope.processUserEvents(res.data.pickupUserEvents);
      });
    });
  }

  getPickupOption(pickupOptionId) {
    return _.find(this.pickupOptions, option => {
      console.log(option._id, pickupOptionId);
      return option._id+'' === pickupOptionId+'';
    });
  }

  processBaskets(baskets) {
    this.season = _.first(baskets).season;
  }

  processUserEvents(loadedUserEvents) {
    let scope = this;
    scope.userEvents = [];
    _.each(loadedUserEvents, userEvent => {
      let actualEvent = userEvent.pickupEventOverride || userEvent.pickupEvent;
      let actualPickupOption = scope.getPickupOption(actualEvent.pickupOption);
      scope.userEvents.push({
        userEvent: userEvent,
        eventNumber: userEvent.pickupEvent.eventNumber,
        startDate: scope.PickupUtils.getStartDateFor(this.season, actualPickupOption, actualEvent),
        endDate: scope.PickupUtils.getEndDateFor(this.season, actualPickupOption, actualEvent),
        userNote: userEvent.userNote,
        adminNote: actualEvent.adminNote,
        delegate: userEvent.delegate,
        absent: userEvent.absent,
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
