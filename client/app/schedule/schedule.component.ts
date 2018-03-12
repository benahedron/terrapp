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
  noBaskets: Boolean = false;
  loading: Boolean = true;
  baskets: IBasket[];
  $timeout: any;

  /*@ngInject*/
  constructor($http, $timeout, $uibModal, PickupOptionsService, PickupUtils) {
    super($uibModal);
    this.$timeout = $timeout;
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
    this.$http.get('/api/memberships/member')
    .then(res => {
      let data = (res.data as any);
      scope.processBaskets(data.baskets as IBasket[]);
      if (scope.baskets.length>0) {
        scope.processUserEvents(data.pickupUserEvents as IPickupUserEvent[]);
        scope.processExtraEvents(data.extraEvents as IExtraEvent[]);
        scope.noBaskets = false;
      }
      else {
        scope.noBaskets = true;
      }

      this.sortUserEvents();
      scope.loading = false;
    });
  }

  getPickupOption(pickupOptionId) {
    return _.find(this.pickupOptions, option => {
      return option._id+'' === pickupOptionId+'';
    });
  }

  processBaskets(baskets: IBasket[]) {
    if (baskets.length>0) {
      this.season = _.first(baskets).season;
      this.baskets = baskets;
    } else {
      this.season = null;
      this.baskets = [];
    }
  }

  processUserEvents(loadedUserEvents) {
    let scope = this;
    scope.userEvents = [];
    _.each(loadedUserEvents, userEvent => {
      let processedEvent = scope.processUserEvent(userEvent);
      scope.userEvents.push(processedEvent);
    });
  }

  processExtraEvents(extraEvents) {
    _.each(extraEvents, extraEvent => {
      let startDate = new Date(extraEvent.date);
      let endDate = new Date(startDate.getTime()+extraEvent.durationMinutes*60*1000);
      this.userEvents.push({
        userEvent: null,
        title: extraEvent.title,
        description: extraEvent.description,
        location: extraEvent.location,
        startDate: startDate,
        endDate: endDate
      });
    })
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
    let eventExtraIds = actualEvent.availableExtras;
    let basketExtras = userEvent.basket.extras;
    let availableExtras = [];
    
    if (basketExtras.length>0 && eventExtraIds.length>0) {
      for (let eventExtraId of eventExtraIds) {
        let match = _.find(basketExtras, candidate => {
          return candidate.extra == eventExtraId;
        });
        if (match) {
          let seasonExtra = _.find(this.season.availableExtras, (extra) => {
            return extra._id == eventExtraId;
          });
          availableExtras.push({
            "name": seasonExtra.name,
            "unit": seasonExtra.unit,
            "quantity": match.quantity
          });
        }
      }
    }
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
      pickupOption: actualPickupOption,
      availableExtras: availableExtras
    };
  }

  getOptionResolve() {
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
      scope.$timeout(() => {
        scope.reload();
      }, 500);
    });
  }

  edit(userEvent) {
    let scope = this;
    this.modal('userPickupEdit', this.getResolve(userEvent), editedUserEvent => {
      let newProcessedEvent = scope.processUserEvent(editedUserEvent);
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
