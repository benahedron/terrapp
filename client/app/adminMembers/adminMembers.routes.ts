'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('adminMembers', {
      url: '/admin/members',
      template: '<admin-members></admin-members>',
      authenticate: 'admin',
      parent: 'terrapp'
    });
}
