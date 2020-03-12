'use strict';

(function () {
  var NEAR_PINS_AMOUNT = 5;
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;

  var pinList = document.querySelector('.map__pins');
  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var housingFeatures = document.querySelectorAll('.map__checkbox');

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
    }).
    filter(function (item) {
      var priceFilter = housingPrice.value;
      var price = item.offer.price;
      switch (priceFilter) {
        case 'any':
          return true;
        case 'middle':
          return price > LOW_PRICE && price < HIGH_PRICE;
        case 'low':
          return price < LOW_PRICE;
        case 'high':
          return price > HIGH_PRICE;
        default:
          return false;
      }
    }).
    filter(function (item) {
      return housingRooms.value === 'any' ? true : item.offer.rooms === +housingRooms.value;
    }).
    filter(function (item) {
      return housingGuests.value === 'any' ? true : item.offer.guests === +housingGuests.value;
    }).
    filter(function (item) {
      var housingFeaturesChecked = document.querySelectorAll('.map__checkbox:checked');
      var hasCheckedFeatures = true;
      housingFeaturesChecked.forEach(function (node) {
        if (!item.offer.features.includes(node.value)) {
          hasCheckedFeatures = false;
          return;
        }
      });
      return hasCheckedFeatures;
    });

    var pinsNearArray = window.utils.randomUniqueSubArray(currentPins, NEAR_PINS_AMOUNT);
    for (var i = 0; i < pinsNearArray.length; i++) {
      fragment.appendChild(window.pin.createPinElement(pinsNearArray[i]));
    }

    pinList.appendChild(fragment);
  };

  var renderMap = window.debounce(function () {
    removeCard();
    renderPins();
  });

  housingType.addEventListener('change', function () {
    renderMap();
  });

  housingPrice.addEventListener('change', function () {
    renderMap();
  });

  housingRooms.addEventListener('change', function () {
    renderMap();
  });

  housingGuests.addEventListener('change', function () {
    renderMap();
  });

  housingFeatures.forEach(function (node) {
    node.addEventListener('change', function () {
      renderMap();
    });
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
    removePins: removePins,
    removeCard: removeCard
  };
})();
