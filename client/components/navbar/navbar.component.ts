'use strict';
/* eslint no-sync: 0 */
const angular = require('angular');

export class NavbarComponent {
  memberMenu = [{
    'title': 'Schedule',
    'state': 'schedule'
  }];
  adminMenu = [{
    'title': 'Members',
    'state': 'adminMembers'
  }, {
    'title': 'Seasons',
    'state': 'adminSeasons'
  }, {
    'title': 'Pickups',
    'state': 'adminPickups'
  }, {
    'title': 'Extra Events',
    'state': 'adminExtraEvents'
  }, {
    'title': 'Pickup Options',
    'state': 'adminPickupOptions'
  }, {
    'title': 'Backup',
    'state': 'adminBackup'
  }];

  isLoggedIn: Function;
  isAdmin: Function;
  isMember: Function;
  getCurrentUser: Function;
  isCollapsed = true;

  constructor(Auth) {
    'ngInject';
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.isMember = Auth.isMemberSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
  }

}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
