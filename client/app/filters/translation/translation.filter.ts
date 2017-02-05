const angular = require('angular');
export default angular.module('terrappApp.TranslationFilter', [])
  .filter('tr', ['TranslationService', TranslationService => {
    return key => {
      return TranslationService.translate(key);
    };
  }])
  .name;
