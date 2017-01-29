'use strict';

const angular = require('angular');

export class AdminPickupManageComponent {
  pickup: Pickup;
  $http: ng.IHttpService;
  pickupOptions: Object[];
  userEvents: Object[];

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
    });
  }

  setDoneState(userEvent, state) {
    let scope = this;
    let stateString = state ? 'true' : 'false':
    this.$http.put('/api/pickupUserEvents/donestate/'+userEvent._id+'/'+stateString)
    .then(result => {
      userEvent.done = result.data.done;
    });
  }

  ok() {;
    (this as any).close({$value: 'ok'});
  }; .

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };
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
