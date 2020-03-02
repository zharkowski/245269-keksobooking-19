'use strict';

(function () {
  var offerTypes = ['palace', 'flat', 'house', 'bungalo'];
  var featuresEnum = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var checks = ['12:00', '13:00', '14:00'];
  var offerTypeMap = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };
  var minPriceMap = {
    'palace': 10000,
    'flat': 1000,
    'house': 5000,
    'bungalo': 0
  };

  window.data = {
    offerTypes: offerTypes,
    featuresEnum: featuresEnum,
    checks: checks,
    offerTypeMap: offerTypeMap,
    minPriceMap: minPriceMap
  };
})();
