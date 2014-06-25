(function (ng) {
  'use strict';
  /* Services */
  ng.module('translate', [], ['$provide', function ($provide) {
    $provide.factory('translate', ['$log', function ($log) {
      var
        localizedStrings = {},
        log = true,
        keys, translation,
        translate = function translate(sourceString) {
          if (!sourceString) {
            return '';
          }
          keys = sourceString.trim().split('.');
          translation = localizedStrings;
          keys.forEach(function (key) {
            translation = (translation || {})[key];
          });
          if (typeof translation === 'string') {
            return {
              t: translation,
              missing: false
            };
          }
          if (log) {
            $log.warn('Missing localisation for "' + sourceString + '"');
          }
          return {
            t: sourceString,
            missing: true
          };
        };
      translate.t = function (sourceString) {
        return translate(sourceString).t;
      };
      translate.add = function (translations) {
        ng.extend(localizedStrings, translations);
      };
      translate.remove = function (key) {
        if (localizedStrings[key]) {
          delete localizedStrings[key];
          return true;
        }
        return false;
      };
      translate.set = function (translations) {
        localizedStrings = translations;
      };
      translate.logMissedHits = function (boolLog) {
        log = boolLog;
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
          var
            translateInnerHtml = false,
            attrsToTranslate;
          if (attrs.translate) {
            attrsToTranslate = attrs.translate.split(' ');
            ng.forEach(attrsToTranslate, function (v) {
              el.attr(v, translate(attrs[v]).t);
            });
            translateInnerHtml = attrsToTranslate.indexOf('innerHTML') >= 0;
          } else {
            translateInnerHtml = true;
          }
          return function preLink(scope, el) {
            if (translateInnerHtml) {
              var tr = translate(el.html());
              el.html((tr.missing ? '<span class="missing-translation">' : '') + tr.t + (tr.missing ? '</span>' : ''));
            }
            $compile(el.contents())(scope);
          };
        }
      };
    }]);
  });
}(angular));
