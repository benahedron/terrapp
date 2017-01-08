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

  delete(user) {
    var modalInstance = this.$uibModal.open({
        component: 'adminMemberDelete',
        resolve: {
          user: function () {
            return user;
          }
        }
      } as ng.ui.bootstrap.IModalSettings
    );

    let scope = this;
    modalInstance.result.then((user) => {
      scope.users.splice(scope.users.indexOf(user), 1);
    }, function () {

    });
  }

  edit(user) {
    var modalInstance = this.$uibModal.open({
        component: 'adminMemberEdit',
        resolve: {
          user: function () {
            return user;
          }
        }
      } as ng.ui.bootstrap.IModalSettings
    );

    let scope = this;
    modalInstance.result.then((editedUser) => {
      _.assign(user, editedUser);

    }, function () {

    });
  }

  create() {
    var modalInstance = this.$uibModal.open({
        component: 'adminMemberEdit',
        resolve: {}
      } as ng.ui.bootstrap.IModalSettings
    );

    let scope = this;
    modalInstance.result.then((newUser) => {
      scope.users.push(newUser);

    }, function () {
    });
  }

  changePassword(user) {
    var modalInstance = this.$uibModal.open({
        component: 'adminMemberPassword',
        resolve: {
          user: function () {
            return user;
          }
        }
      } as ng.ui.bootstrap.IModalSettings
    );

    let scope = this;
    modalInstance.result.then((user) => {
    }, function () {
    });
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
