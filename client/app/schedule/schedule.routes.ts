'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('schedule', {
      url: '/schedule',
      template: '<schedule></schedule>',
      authenticate: 'user'
    });
}
