'use strict';
const angular = require('angular');

export default angular.module('terrappApp.pickupOptionMap', [])
  .directive('pickupOptionMap', function(PickupOptionsService, $uibModal) {
    return {
      template: require('./pickupOptionMap.html'),
      restrict: 'E',
      scope: {
        option: '=',
        hoverable: '@'
      }
      link: function(scope, element, attrs) {
        scope.showMap = function() {
          if (scope.pickupOption) {
            $uibModal.open({
                component: 'pickupOptionMapWindow',
                resolve: {
                  pickupOption: function () {
                    return scope.pickupOption;
                  }
                }
              } as ng.ui.bootstrap.IModalSettings
            );
            }
        }
        scope.$watch('option', () => {
          PickupOptionsService.get()
            .then(options => {
              scope.pickupOption = _.find(options, option => {
                return option._id + '' === scope.option;
              });
            });
        });
      }
    };
  })
  .name;
