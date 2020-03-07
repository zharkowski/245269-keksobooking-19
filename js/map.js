'use strict';

(function () {
  var NEAR_PINS_AMOUNT = 8;

  var pinList = document.querySelector('.map__pins');

  var renderPins = function (pinsArray) {
    var fragment = document.createDocumentFragment();

    var pinsNearArray = window.utils.randomUniqueSubArray(pinsArray, NEAR_PINS_AMOUNT);
    for (var i = 0; i < pinsNearArray.length; i++) {
      fragment.appendChild(window.pin.createPinElement(pinsNearArray[i]));
    }

    pinList.appendChild(fragment);
  };

  var mapElement = document.querySelector('.map');
  var mapFiltersContainer = mapElement.querySelector('.map__filters-container');

  var renderCard = function (card) {
    var currentCard = mapElement.querySelector('.map__card');
    if (currentCard) {
      currentCard.remove();
    }
    var fragment = document.createDocumentFragment();
    fragment.appendChild(window.card.createPinCardElement(card));
    mapElement.insertBefore(fragment, mapFiltersContainer);
  };

  window.map = {
    renderPins: renderPins,
    renderCard: renderCard
  };
})();
