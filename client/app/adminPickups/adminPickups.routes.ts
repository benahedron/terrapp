'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('adminPickups', {
      url: '/adminPickups',
      template: '<admin-pickups></admin-pickups>',
      authenticate: 'admin'
    });
}
