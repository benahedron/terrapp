'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('schedule', {
      url: '/:lang/schedule',
      template: '<schedule></schedule>',
      authenticate: 'user',
      parent: 'terrapp'
    });
}
