'use strict';

const angular = require('angular');
import {AdminPickupBase} from './adminPickupBase'

export class AdminPickupManageComponent extends AdminPickupBase{
  editUserEvent: IPickupUserEvent = null;
  pickupEventAlternatives:IPickupEvent[];

  /*ngInjector*/
  constructor($http, PickupUtils, PickupOptionsService) {
    super($http, PickupUtils, PickupOptionsService);
  }

  setDoneState(userEvent: IPickupUserEvent, state) {
    let scope = this;
    let stateString = state ? 'true' : 'false';
    this.$http.put('/api/pickupUserEvents/donestate/'+userEvent._id+'/'+stateString, null)
    .then(result => {
      userEvent.done = (result.data as IPickupUserEvent).done;
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
    }
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
