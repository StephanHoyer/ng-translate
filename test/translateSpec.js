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
    }));
    it('should warn and return source string if no translation found', inject(function(translate) {
      expect(translate('newfoo')).toEqual('newfoo');
      expect(mock.warn).toHaveBeenCalledWith('Missing localisation for "newfoo"');
    }));
  });
});

