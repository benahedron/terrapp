'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './schedule.routes';
import {ModalBase} from '../shared/modal.base';

export class ScheduleComponent extends ModalBase{
  $http: ng.IHttpService;
  PickupOptionsService: IPickupOptionsService;
  pickupOptions: IPickupOption[];
  userEvents = [];
  season: ISeason;
  PickupUtils: IPickupUtilsService;

  /*@ngInject*/
  constructor($http, $uibModal, PickupOptionsService, PickupUtils) {
    super($uibModal);
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
      this.reload();
    });
  }

  reload() {
    let scope = this;
    this.$http.get('/api/baskets/user')
    .then(res => {
      scope.processBaskets((res.data as any).baskets as IBasket[]);
      scope.processUserEvents((res.data as any).pickupUserEvents as IPickupUserEvent[]);
    });
  }

  getPickupOption(pickupOptionId) {
    return _.find(this.pickupOptions, option => {
      return option._id+'' === pickupOptionId+'';
    });
  }

  processBaskets(baskets: IBasket[]) {
    this.season = _.first(baskets).season;
    this.baskets = baskets;
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
    let now = new Date().getTime();
    this.userEvents = _.sortBy(this.userEvents, candidate => {
      if (now > candidate.startDate.getTime()) {
        /// Add to the end of the list
        return candidate.startDate.getTime()+365*24*60*60*1000;
      } else {
        return candidate.startDate.getTime();
      }
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
    let actualPickupOptionForDateId = actualEvent.pickupOption;
    if (_.has(actualPickupOptionForDateId, '_id')) {
      actualPickupOptionForDateId = actualPickupOptionForDateId._id;
    }
    let actualPickupOptionForDate = scope.getPickupOption(actualPickupOptionForDateId);
    return {
      userEvent: userEvent,
      actualEvent: actualEvent,
      eventNumber: userEvent.pickupEvent.eventNumber,
      startDate: scope.PickupUtils.getStartDateFor(this.season, actualPickupOptionForDate, actualEvent),
      endDate: scope.PickupUtils.getEndDateFor(this.season, actualPickupOptionForDate, actualEvent),
      userNote: userEvent.userNote,
      adminNote: actualEvent.adminNote,
      delegate: userEvent.delegate,
      absent: userEvent.absent,
      editable: userEvent.editable,
      old: userEvent.old,
      done: userEvent.done,
      pickupOption: actualPickupOption
    };
  }

  getOptionResolve(userEvent) {
    let scope = this;
    return {
      season: function () {
        return scope.season;
      },
      baskets: function () {
        return scope.baskets;
      },
    };
  }

  getResolve(userEvent) {
    let scope = this;
    return {
      season: function () {
        return scope.season;
      },
      userEvent: function () {
        return userEvent;
      }
    };
  }

  changePickupOption() {
    let scope = this;
    this.modal('changePickupOption', this.getOptionResolve(), () => {
      scope.reload();
    });
  });

  edit(userEvent) {
    let scope = this;
    this.modal('userPickupEdit', this.getResolve(userEvent), editedUserEvent => {
      let newProcessedEvent = scope.processUserEvent(editedUserEvent, false);
      let oldProcessedEvent = _.find(scope.userEvents, candidateEvent => {
        return candidateEvent.userEvent._id+'' === userEvent._id+'';
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
