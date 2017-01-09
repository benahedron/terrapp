'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './adminMembers.routes';

export class AdminMembersComponent {
  getCurrentUser: Function;
  users: Object[];
  $uibModal: ng.ui.bootstrap.IModalService;
  $scope: Object;

  /*@ngInject*/
  constructor(User, $uibModal, Auth, $scope) {
    this.$scope = $scope;
    this.users = User.query();
    this.$uibModal = $uibModal;
    this.getCurrentUser = Auth.getCurrentUserSync;
  }

  modal(user, component, successCallback) {
    var modalInstance = this.$uibModal.open({
        component: component,
        resolve: {
          user: function () {
            return user;
          }
        }
      } as ng.ui.bootstrap.IModalSettings);

    let scope = this;
    modalInstance.result.then((editedUser) => {
      successCallback(editedUser);
    });
  }

  delete(user) {
    let scope = this;
    this.modal(user, 'adminMemberDelete', (user) => {
      scope.users.splice(scope.users.indexOf(user), 1);
    });
  }

  edit(user) {
    this.modal(user, 'adminMemberEdit', (editedUser) => {
      _.assign(user, editedUser);
    });
  }

  create() {
    let scope = this;
    this.modal(null, 'adminMemberEdit', (user) => {
      scope.users.push(user);
    });
  }

  changePassword(user) {
    this.modal(user, 'adminMemberPassword', (user) => {});
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
