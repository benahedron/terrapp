'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './schedule.routes';

export class ScheduleComponent {
  $http: Object;
  $uibModal: Object;
  PickupOptionsService: Object;
  pickupOptions: Object[];
  userEvents = [];
  season: Object;
  PickupUtils: Object;

  /*@ngInject*/
  constructor($http, $uibModal, PickupOptionsService, PickupUtils) {
    this.$http = $http;
    this.$uibModal = $uibModal;
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
      let processedEvent = scope.processUserEvent(userEvent);
      scope.userEvents.push(processedEvent);
    });

    this.sortUserEvents();
  }

  sortUserEvents() {
    this.userEvents = _.sortBy(this.userEvents, candidate => {
      return candidate.startDate.getTime();
    });
  }

  processUserEvent(userEvent) {
    let scope = this;
    let actualEvent = userEvent.pickupEventOverride || userEvent.pickupEvent;
    let actualPickupOptionId = actualEvent.pickupOptionOverride || actualEvent.pickupOption;
    if (_.has(actualPickupOptionId, '_id')) {
      actualPickupOptionId = actualPickupOptionId._id;
    }
    let actualPickupOption = scope.getPickupOption(actualPickupOptionId);
    return {
      userEvent: userEvent,
      eventNumber: userEvent.pickupEvent.eventNumber,
      startDate: scope.PickupUtils.getStartDateFor(this.season, actualPickupOption, actualEvent),
      endDate: scope.PickupUtils.getEndDateFor(this.season, actualPickupOption, actualEvent),
      userNote: userEvent.userNote,
      adminNote: actualEvent.adminNote,
      delegate: userEvent.delegate,
      absent: userEvent.absent,
      pickupOption: actualPickupOption
    };
  }

  modal(userEvent, component, successCallback) {
    let scope = this;
    var modalInstance = this.$uibModal.open({
        component: component,
        resolve: {
          season: function () {
            return scope.season;
          }
          userEvent: function () {
            return userEvent;
          }
        }
    } as ng.ui.bootstrap.IModalSettings);

    let scope = this;
    modalInstance.result.then((editedEvent) => {
      successCallback(editedEvent);
    });
  }

  edit(userEvent) {
    let scope = this;
    this.modal(userEvent, 'userPickupEdit', editedUserEvent => {
      let newProcessedEvent = scope.processUserEvent(editedUserEvent);
      let oldProcessedEvent = _.find(scope.userEvents, candidateEvent => {
        return candidateEvent.userEvent._id === userEvent._id;
      })
      if (oldProcessedEvent && newProcessedEvent) {
        _.assign(oldProcessedEvent, newProcessedEvent);
        scope.sortUserEvents();
      }
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
