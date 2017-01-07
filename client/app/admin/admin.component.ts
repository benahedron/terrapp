'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './admin.routes';

export class AdminComponent {
  users: Object[];

  /*@ngInject*/
  constructor(User) {
    // Use the User $resource to fetch all users
    this.users = User.query();
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
}

export default angular.module('terrappApp.admin', [
    'terrappApp.auth',
    uiRouter
  ])
  .config(routes)
  .component('admin', {
    template: require('./admin.html'),
    controller: AdminComponent,
    controllerAs: 'adminCtrl'
  })
  .name;
