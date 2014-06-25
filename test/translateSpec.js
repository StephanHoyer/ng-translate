'use strict';
describe('translateService', function() {
  var mock;
  beforeEach(function () {
    mock = {warn: jasmine.createSpy()};
    module('translate', function($provide) {
      $provide.value('$log', mock);
    });
  });
  describe('translate', function() {
    it('should return translated string', inject(function(translate) {
      translate.add({'foo': 'bar'});
      expect(translate('foo')).toEqual({t: 'bar', missing: false});
      expect(mock.warn).wasNotCalled();
    }));
    it('should warn and return source string if no translation found', inject(function(translate) {
      expect(translate('newfoo')).toEqual({t: 'newfoo', missing: true});
      expect(mock.warn).toHaveBeenCalledWith('Missing localisation for "newfoo"');
    }));
    it('should warn and return source string if no translation found', inject(function(translate) {
      translate.set({'newfoo': 'newbar'});
      expect(translate('newfoo')).toEqual({t: 'newbar', missing: false});
      expect(mock.warn).wasNotCalled();
    }));
    it('should warn and return source string if no translation found', inject(function(translate) {
      translate.remove('newfoo');
      expect(translate('newfoo')).toEqual({t: 'newfoo', missing: true});
      expect(mock.warn).toHaveBeenCalledWith('Missing localisation for "newfoo"');
    }));
    it('should warn and return source string if no translation found', inject(function(translate) {
      translate.logMissedHits(false);
      expect(translate('newfoo')).toEqual({t: 'newfoo', missing: true});
      expect(mock.warn).wasNotCalled();
    }));
    it('should not strip inner html elements', inject(function($compile, $rootScope, translate) {
      var html = 'aaa<span>foo</span>ccc'
      var transhtml = 'bbb<span>bar</span>ddd';
      var translations = {};
    translations[html] = transhtml;
    translate.set(translations);
    expect(translate.t(html)).toEqual(transhtml);
    }));
    it('should translate with several levels of translations', inject(function(translate) {
      translate.add({'one': {'two': {'three': {'four': {'five': '5 levels'}}}}});
      expect(translate('one.two.three.four.five')).toEqual({t: '5 levels', missing: false});
      expect(mock.warn).wasNotCalled();
    }));
  });
});
describe('translateDirective', function() {
  var html = 'xxx<a>yyy</a>zzz';
  var html_missing = 'missing';
  var mock = function() {
    return function(source) {
      if (source === 'html') {
        return {t: html, missing: false};
      }
      if (source === 'missing') {
        return {t: html_missing, missing: true};
      }
      return {t: 'translation', missing: false};
    };
  };
  beforeEach(function () {
    module('translate.directives', function($provide) {
      $provide.factory('translate', mock);
    });
  });
  describe('translate', function() {
    it('should translate elements content', inject(function($compile, $rootScope) {
      var element = $compile('<div translate>foo</div>')($rootScope);
      $rootScope.$apply();
      expect(element.html()).toBe('<span class="ng-scope">translation</span>');
    }));
    it('should translate elements attribute', inject(function($compile, $rootScope) {
      var element = $compile('<div translate="bar" bar="value"/>')($rootScope);
      $rootScope.$apply();
      expect(element.attr('bar')).toBe('translation');
    }));
    it('should translate elements attribute but not innerHTML', inject(function($compile, $rootScope) {
      var element = $compile('<div translate="bar" bar="value"/>foo</div>')($rootScope);
      $rootScope.$apply();
      expect(element.attr('bar')).toBe('translation');
      expect(element.html()).toBe('<span class="ng-scope">foo</span>');
    }));
    it('should translate elements attribute and innerHTML if attr is set accordingly', inject(function($compile, $rootScope) {
      var element = $compile('<div translate="bar innerHTML" bar="value"/>foo</div>')($rootScope);
      $rootScope.$apply();
      expect(element.attr('bar')).toBe('translation');
      expect(element.html()).toBe('<span class="ng-scope">translation</span>');
    }));
    it('should not strip inner html elements', inject(function($compile, $rootScope) {
      var element = $compile('<div translate>html</div>')($rootScope);
      $rootScope.$apply();
      var compiledHtml = '<span class="ng-scope">xxx</span>' +
                         '<a class="ng-scope">yyy</a>' +
                         '<span class="ng-scope">zzz</span>';
      expect(element.html()).toBe(compiledHtml);
    }));
    it('should add a class "missing-translation" when translation is missing', inject(function($compile, $rootScope) {
      var element = $compile('<div translate>missing</div>')($rootScope);
      $rootScope.$apply();
      expect(element.html()).toBe('<span class="missing-translation ng-scope">missing</span>');
    }));
  });
});

