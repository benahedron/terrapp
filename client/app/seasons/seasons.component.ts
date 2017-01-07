'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './seasons.routes';

export class SeasonsComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('terrappApp.seasons', [uiRouter])
  .config(routes)
  .component('seasons', {
    template: require('./seasons.html'),
    controller: SeasonsComponent,
    controllerAs: 'seasonsCtrl'
  })
  .name;
