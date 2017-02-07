'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './adminMembers.routes';
import {ModalBase} from '../shared/modal.base';

export class AdminMembersComponent extends ModalBase{
  getCurrentUser: Function;
  users: Object[];
  $scope: Object;

  /*@ngInject*/
  constructor(User, $uibModal, Auth, $scope) {
    super($uibModal);
    this.$scope = $scope;
    this.users = User.query();
    this.getCurrentUser = Auth.getCurrentUserSync;
  }

  getResolve(user) {
    return {
      user: function () {
        return user;
      }
    }
  }

  delete(user) {
    let scope = this;
    this.modal('adminMemberDelete', this.getResolve(user), (user) => {
      scope.users.splice(scope.users.indexOf(user), 1);
    });
  }

  edit(user) {
    this.modal('adminMemberEdit', this.getResolve(user), (editedUser) => {
      _.assign(user, editedUser);
    });
  }

  create() {
    let scope = this;
    this.modal('adminMemberEdit', this.getResolve(null), (user) => {
      scope.users.push(user);
    });
  }

  changePassword(user) {
    this.modal('adminMemberPassword', this.getResolve(user), (user) => {});
  }
}

export default angular.module('terrappApp.adminMembers', [
    'terrappApp.auth',
    uiRouter
  ])
  .config(routes)
  .component('adminMembers', {
    template: require('./adminMembers.html'),
    controller: AdminMembersComponent,
    controllerAs: '$ctrl'
  })
  .name;
