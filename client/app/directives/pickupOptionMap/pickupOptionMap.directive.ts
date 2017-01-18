'use strict';
const angular = require('angular');

export default angular.module('terrappApp.pickupOptionMap', [])
  .directive('pickupOptionMap', function(PickupOptionsService) {
    return {
      template: require('./pickupOptionMap.html'),
      restrict: 'E',
      scope: {
        option: '=',
        hoverable: '@'
      }
      link: function(scope, element, attrs) {
          PickupOptionsService.get()
            .then(options => {
              scope.pickupOption = _.find(options, option => {
                return option._id + '' === scope.option;
              });
            });
          
      }
    };
  })
  .name;
