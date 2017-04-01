'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('adminBackup', {
      url: '/adminBackup/',
      template: '<admin-backup></admin-backup>',
      authenticate: 'admin',
      parent: 'terrapp'
    });
}
