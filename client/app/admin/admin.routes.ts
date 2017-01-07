'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('admin', {
      url: '/admin',
      template: '<admin></admin>',
      authenticate: 'admin'
    });
}
