'use strict';

(function () {
  var pinList = document.querySelector('.map__pins');

  var renderPins = function (pinsArray) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < pinsArray.length; i++) {
      fragment.appendChild(window.pin.createPinElement(pinsArray[i]));
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
