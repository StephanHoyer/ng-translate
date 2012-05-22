(function (ng) {
  'use strict';
  /* Services */
  ng.module('translate', [], ['$provide', function ($provide){
    $provide.factory('translate', ['$log', function ($log) {
      var localizedStrings = {};
      var translate = function translate(sourceString) {
        sourceString = sourceString.trim();
        if (!sourceString) {
          return '';
        }
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
  ng.module('translate.directives', [], function ($compileProvider) {
    $compileProvider.directive('translate', ['$compile', 'translate', function ($compile, translate) {
      return {
        priority: 10, //Should be evaluated befor e. G. pluralize
        restrict: 'ECMA',
        compile: function compile(el, attrs) {
          if (attrs.translate) {
            var translateAttrs = attrs.translate.split(' ');
            for(var i=0; i<translateAttrs.length; i+=1) {
              el.attr(translateAttrs[i], translate(attrs[translateAttrs[i]]));
            }
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
