'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('adminMembers', {
      url: '/:lang/admin/members',
      template: '<admin-members></admin-members>',
      authenticate: 'admin'
    });
}
