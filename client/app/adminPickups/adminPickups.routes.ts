'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('adminPickups', {
      url: '/adminPickups/:seasonId?7:pickupOptionId?',
      template: '<admin-pickups></admin-pickups>',
      authenticate: 'admin'
    });
}
