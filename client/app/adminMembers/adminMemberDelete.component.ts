'use strict';

const angular = require('angular');

export class AdminMemberDeleteComponent{
  user: ng.resource.IResource<IUser>;

  /*ngInjector*/
  $onInit() {
    this.user = (this as any).resolve.user;
  }

  ok() {
    this.user.$remove();
    (this as any).close({$value: this.user});
  };

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };
}


export default angular.module('terrappApp.adminMembers')
  .component('adminMemberDelete', {
    template: require('./adminMemberDelete.html'),
    controller: AdminMemberDeleteComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  }).name;
