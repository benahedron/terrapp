'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('adminPickupOptions', {
      url: '/admin/pickupoptions',
      template: '<admin-pickup-options></admin-pickup-options>',
      authenticate: 'admin'
    });
}
