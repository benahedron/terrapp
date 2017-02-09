const angular = require('angular');
export default angular.module('terrappApp.TrustedFilter', [])
.filter('trusted', ['$sce', $sce => {
  return url => {
    return $sce.trustAsResourceUrl(url);
  };
}])
.name;
