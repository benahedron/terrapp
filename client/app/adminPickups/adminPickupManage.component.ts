'use strict';

const angular = require('angular');

export class AdminPickupManageComponent {
  pickup: Pickup;
  $http: ng.IHttpService;
  pickupOptions: Object[];
  userEvents: Object[];
  editUserEvent: Object = null;
  pickupEventAlternatives:Object[];
  /*ngInjector*/
  constructor($http, PickupUtils, PickupOptionsService) {
    this.$http = $http;
    this.PickupUtils = PickupUtils;
    this.PickupOptionsService = PickupOptionsService;
  }

  $onInit() {
    let resolve = (this as any).resolve;
    if (_.has(resolve, 'pickup') && resolve.pickup !== null) {
      this.pickup = resolve.pickup;
      this.season = resolve.season;
      this.load()
    } else {
      this.cancel();
    }
  }

  private load() {
    let scope = this;
    this.$http.get('/api/pickupUserEvents/byEvent/'+this.pickup._id)
    .then(result => {
      scope.userEvents = result.data;
      _.each(scope.userEvents, userEvent => {
        scope.calculateStartTime(userEvent);
      });
      this.$http.get('/api/pickupEvents/alternatives/'+this.pickup._id+'/')
      .then(result => {
        scope.pickupEventAlternatives = result.data;
        _.each(scope.pickupEventAlternatives, alternativePickup => {
          alternativePickup.startDate = scope.PickupUtils.getStartDateFor(scope.season, alternativePickup.pickupOption, alternativePickup);
        })
      });
    });
  }

  getRequiredBaskets() {
    let requiredBaskets = 0;
    let scope = this;
    _.each(this.userEvents, userEvent => {
      if (((userEvent.pickupEventOverride && userEvent.pickupEventOverride._id === scope.pickup._id) ||
          (!userEvent.pickupEventOverride && userEvent.pickupEvent._id === scope.pickup._id))&&
          !userEvent.absent) {
            requiredBaskets++;
      }
    });
    return requiredBaskets;
  }

  setDoneState(userEvent, state) {
    let scope = this;
    let stateString = state ? 'true' : 'false':
    this.$http.put('/api/pickupUserEvents/donestate/'+userEvent._id+'/'+stateString)
    .then(result => {
      userEvent.done = result.data.done;
    });
  }

  getAlternatives() {
    return this.pickupEventAlternatives;
  }

  saveUserEvent(userEvent, oldUserEvent) {
    let scope = this;
    this.$http.put('/api/pickupUserEvents/'+userEvent._id+'/', userEvent)
    .then(result => {
      this.setEditUserEvent(null);
      _.assign(oldUserEvent, result.data);
      scope.calculateStartTime(oldUserEvent);
    });
  }

  private calculateStartTime(userEvent) {
    if (userEvent.pickupEventOverride) {
      userEvent.pickupEventOverride.startDate = this.PickupUtils.getStartDateFor(this.season, userEvent.pickupEventOverride.pickupOption, userEvent.pickupEventOverride);
    }
    if (userEvent.pickupEvent) {
      userEvent.pickupEvent.startDate = this.PickupUtils.getStartDateFor(this.season, userEvent.pickupEvent.pickupOption, userEvent.pickupEvent);
    }
  }


  setEditUserEvent(userEvent) {
    if (!userEvent || (this.editUserEvent && this.editUserEvent._id === userEvent._id)) {
      this.editUserEvent = null;
    } else {
      this.editUserEvent = _.cloneDeep(userEvent);
    }

  }

  ok() {;
    (this as any).close({$value: 'ok'});
  }; .

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };

  setPickupOverride(userEvent, original, override) {
    if (original._id === override._id) {
      userEvent.pickupEventOverride = null;
    } else {
      userEvent.pickupEventOverride = override;
    })
  }
}


export default angular.module('terrappApp.adminPickups')
  .component('adminPickupManage', {
    template: require('./adminPickupManage.html'),
    controller: AdminPickupManageComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  }).name;
