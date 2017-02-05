'use strict';

const angular = require('angular');
let AdminPickupBase = require('./adminPickupBase').AdminPickupBase;

export class AdminPickupManageComponent  extends AdminPickupBase{
  editUserEvent: Object = null;
  pickupEventAlternatives:Object[];

  /*ngInjector*/
  constructor($http, PickupUtils, PickupOptionsService) {
    super($http, PickupUtils, PickupOptionsService);
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

  setEditUserEvent(userEvent) {
    if (!userEvent || (this.editUserEvent && this.editUserEvent._id === userEvent._id)) {
      this.editUserEvent = null;
    } else {
      this.editUserEvent = _.cloneDeep(userEvent);
    }

  }

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
