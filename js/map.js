'use strict';

(function () {
  var NEAR_PINS_AMOUNT = 5;

  var pinList = document.querySelector('.map__pins');
  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var housingFeatures = document.querySelector('#housing-features');

  var removePins = function () {
    var pins = document.querySelectorAll('.map__pin');
    for (var i = 0; i < pins.length; i++) {
      if (!pins[i].classList.contains('map__pin--main')) {
        pins[i].remove();
      }
    }
  };

  var renderPins = function () {
    removePins();
    var fragment = document.createDocumentFragment();

    var currentPins = window.pins;
    currentPins = currentPins.
    filter(function (item) {
      return housingType.value === 'any' ? true : item.offer.type === housingType.value;
    });

    var pinsNearArray = window.utils.randomUniqueSubArray(currentPins, NEAR_PINS_AMOUNT);
    for (var i = 0; i < pinsNearArray.length; i++) {
      fragment.appendChild(window.pin.createPinElement(pinsNearArray[i]));
    }

    pinList.appendChild(fragment);
  };

  housingType.addEventListener('change', function () {
    removeCard();
    renderPins();
  });

  var mapElement = document.querySelector('.map');
  var mapFiltersContainer = mapElement.querySelector('.map__filters-container');

  var removeCard = function () {
    var currentCard = mapElement.querySelector('.map__card');
    if (currentCard) {
      currentCard.remove();
    }
  };

  var renderCard = function (card) {
    removeCard();
    var fragment = document.createDocumentFragment();
    fragment.appendChild(window.card.createPinCardElement(card));
    mapElement.insertBefore(fragment, mapFiltersContainer);
  };

  window.map = {
    renderPins: renderPins,
    renderCard: renderCard,
    removePins: removePins
  };
})();
