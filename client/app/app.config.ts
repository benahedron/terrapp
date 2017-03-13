'use strict';

export function routeConfig($urlRouterProvider, $locationProvider) {
  'ngInject';

  $urlRouterProvider
    .otherwise('/en/');

  $locationProvider.html5Mode(true);
}
