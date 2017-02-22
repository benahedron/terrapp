'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('adminExtraEvents', {
      url: '/adminExtraEvents/:seasonId?',
      template: '<admin-extra-events></admin-extra-events>',
      authenticate: 'admin'
    });
}
