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
      expect(translate('foo')).toEqual('bar');
      expect(mock.warn).wasNotCalled();
    }));
    it('should warn and return source string if no translation found', inject(function(translate) {
      expect(translate('newfoo')).toEqual('newfoo');
      expect(mock.warn).toHaveBeenCalledWith('Missing localisation for "newfoo"');
    }));
    it('should warn and return source string if no translation found', inject(function(translate) {
      translate.set({'newfoo': 'newbar'});
      expect(translate('newfoo')).toEqual('newbar');
      expect(mock.warn).wasNotCalled();
    }));
    it('should warn and return source string if no translation found', inject(function(translate) {
      translate.remove('newfoo');
      expect(translate('newfoo')).toEqual('newfoo');
      expect(mock.warn).toHaveBeenCalledWith('Missing localisation for "newfoo"');
    }));
    it('should warn and return source string if no translation found', inject(function(translate) {
      translate.logMissedHits(false);
      expect(translate('newfoo')).toEqual('newfoo');
      expect(mock.warn).wasNotCalled();
    }));
  });
});
describe('translateDirective', function() {
  var mock = function() { return function() {
    return 'translation';
  }};
  beforeEach(function () {
    module('translate.directives', function($provide) {
      $provide.factory('translate', mock);
    });
  });
  describe('translate', function() {
    it('should translate elements content', inject(function($compile, $rootScope, translate) {
      var element = $compile('<div translate>foo</div>')($rootScope);
      $rootScope.$apply();
      expect(element.html()).toBe('<span class="ng-scope">translation</span>');
    }));
    it('should translate elements attribute', inject(function($compile, $rootScope, translate) {
      var element = $compile('<div translate="bar" bar="value"/>')($rootScope);
      $rootScope.$apply();
      expect(element.attr('bar')).toBe('translation');
    }));
    it('should translate elements attribute but not innerHTML', inject(function($compile, $rootScope, translate) {
      var element = $compile('<div translate="bar" bar="value"/>foo</div>')($rootScope);
      $rootScope.$apply();
      expect(element.attr('bar')).toBe('translation');
      expect(element.html()).toBe('<span class="ng-scope">foo</span>');
    }));
    it('should translate elements attribute and innerHTML if attr is set accordingly', inject(function($compile, $rootScope, translate) {
      var element = $compile('<div translate="bar innerHTML" bar="value"/>foo</div>')($rootScope);
      $rootScope.$apply();
      expect(element.attr('bar')).toBe('translation');
      expect(element.html()).toBe('<span class="ng-scope">translation</span>');
    }));
  });
});

