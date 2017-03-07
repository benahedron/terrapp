'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('adminPickups', {
      url: '/:lang/adminPickups/:seasonId?/:pickupOption?/:interval?',
      template: '<admin-pickups></admin-pickups>',
      authenticate: 'admin'
    });
}
