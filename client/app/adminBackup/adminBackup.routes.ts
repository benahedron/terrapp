'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('adminBackup', {
      url: '/:lang/adminBackup/',
      template: '<admin-backup></admin-backup>',
      authenticate: 'admin'
    });
}
