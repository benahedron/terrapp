'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('adminSeasons', {
      url: '/:lang/adminSeasons',
      template: '<admin-seasons></admin-seasons>',
      authenticate: 'admin'
    });
}
