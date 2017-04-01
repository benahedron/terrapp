'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('adminSeasons', {
      url: '/adminSeasons',
      template: '<admin-seasons></admin-seasons>',
      authenticate: 'admin',
      parent: 'terrapp'
    });
}
