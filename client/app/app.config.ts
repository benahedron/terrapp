'use strict';

export function routeConfig($urlRouterProvider, $locationProvider, $stateProvider) {
  'ngInject';

  $urlRouterProvider
    .otherwise('/en/');

  $locationProvider.html5Mode(true);

  $stateProvider
    .state('terrapp', {
      url: '/:lang',
      abstract: true,
      template: require('./app.html')
    });
}
