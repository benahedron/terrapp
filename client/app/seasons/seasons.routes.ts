'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('seasons', {
      url: '/admin/seasons',
      template: '<seasons></seasons>',
      authenticate: 'admin'
    });
}
