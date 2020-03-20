'use strict';

(function () {
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
    offerTypeMap: offerTypeMap,
    minPriceMap: minPriceMap
  };
})();
