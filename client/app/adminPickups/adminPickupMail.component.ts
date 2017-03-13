'use strict';

const angular = require('angular');
import {AdminPickupBase} from './adminPickupBase'

export class AdminPickupMailComponent extends AdminPickupBase{
  editMail: IMail = null;

  /*ngInjector*/
  constructor($http, PickupUtils, PickupOptionsService) {
    super($http, PickupUtils, PickupOptionsService);
  }

  newMail() {
    this.pickup.mails.push({
      message: "",
      subject: "Pickup information",
      sent: false,
      date: null
    } as IMail);
    this.save(updatedPickup => {
      this.editMail = _.last(updatedPickup.mails as IMail[]);
    });
  }

  edit(mail: IMail) {
    if (mail.sent) {
      return;
    }

    if (!this.editMail || (mail._id+'' != this.editMail._id+'')) {
      this.editMail = _.cloneDeep(mail);
    } else {
      this.editMail = null;
    }
  }

  delete(mail) {
    this.editMail = null;
    this.pickup.mails = _.without(this.pickup.mails, mail);
    this.save(updatedPickup => {
    });
  }

  cancel() {
    this.editMail = null;
  }

  update(editMail, mail) {

    _.assign(mail, editMail);
    this.save(() => {
      this.editMail = null;
    });
  }

  save(callback?) {
    let scope = this;
    this.$http.patch('/api/pickupEvents/'+this.pickup._id, this.pickup)
    .then(res => {
      scope.pickup = res.data as IPickupEvent;
      if (callback) {
        callback(res.data);
      }
    });
  }

  send(mail) {
    let scope = this;
    this.$http.post('/api/pickupEvents/send/'+this.pickup._id+'/'+mail._id, null)
    .then(res => {
      scope.pickup = res.data as IPickupEvent;
    });
  }


  ok() {
    (this as any).resolve.pickupEvent = this.pickup;
    (this as any).close({$value: this.pickup});
  };
}


export default angular.module('terrappApp.adminPickups')
  .component('adminPickupMail', {
    template: require('./adminPickupMail.html'),
    controller: AdminPickupMailComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  }).name;
