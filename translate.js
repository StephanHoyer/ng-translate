(function (ng) {
  'use strict';
  /* Services */
  ng.module('translate', [], ['$provide', function ($provide){
    $provide.factory('translate', ['$log', function ($log) {
      var localizedStrings = {};
      var translate = function translate(sourceString) {
        if (localizedStrings[sourceString]) {
          return localizedStrings[sourceString];
        } else {
          $log.warn('Missing localisation for "' + sourceString + '"');
          return sourceString;
        }
      };
      translate.add = function (translations) {
        $.extend(localizedStrings, translations);
      };
      return translate;
    }]);
  }]);

  /* Directives */
  ng.module('translate.directives', [])
    .directive('translate', ['$compile', 'translate', function ($compile, translate) {
    return {
      restrict: 'ECMA',
      compile: function compile(el, attrs) {
        return function preLink(scope, el, attrs) {
          el.text(translate(el.text()));
          $compile(el.contents())(scope);
        };
      }
    };
  }]);
}(angular));
