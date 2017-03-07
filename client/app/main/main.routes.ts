'use strict';


export default function routes($stateProvider) {
  'ngInject';
  $stateProvider
    .state('main', {
      url: '/:lang/',
      template: '<main></main>'
    });
};
