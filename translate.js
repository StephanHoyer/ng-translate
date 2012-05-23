(function (ng) {
  'use strict';
  /* Services */
  ng.module('translate', [], ['$provide', function ($provide){
    $provide.factory('translate', ['$log', function ($log) {
      var localizedStrings = {};
      var translate = function translate(sourceString) {
        if (!sourceString) {
          return '';
        }
        sourceString = sourceString.trim();
        if (localizedStrings[sourceString]) {
          return localizedStrings[sourceString];
        } else {
          $log.warn('Missing localisation for "' + sourceString + '"');
          return sourceString;
        }
      };
      translate.add = function (translations) {
        ng.extend(localizedStrings, translations);
      };
      return translate;
    }]);
  }]);

  /* Directives */
  ng.module('translate.directives', [], function ($compileProvider) {
    $compileProvider.directive('translate', ['$compile', 'translate', function ($compile, translate) {
      return {
        priority: 10, //Should be evaluated befor e. G. pluralize
        restrict: 'ECMA',
        compile: function compile(el, attrs) {
          if (attrs.translate) {
            ng.forEach(attrs.translate.split(' '), function(v, k) {
              el.attr(v, translate(attrs[v]));
            });
          }
          return function preLink(scope, el, attrs) {
            el.text(translate(el.text()));
            $compile(el.contents())(scope);
          };
        }
      };
    }]);
  });
}(angular));
