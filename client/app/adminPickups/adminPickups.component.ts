'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './adminPickups.routes';

export class AdminPickupsComponent {
  /*@ngInject*/
  constructor() {

  }
}

export default angular.module('terrappApp.adminPickups', [uiRouter])
  .config(routes)
  .component('adminPickups', {
    template: require('./adminPickups.html'),
    controller: AdminPickupsComponent,
    controllerAs: '$ctrl'
  })
  .name;
