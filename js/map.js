'use strict';

(function () {
  var NEAR_PINS_AMOUNT = 5;
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;

  var pinList = document.querySelector('.map__pins');
  var housingType = document.querySelector('.map__filter[name=housing-type]');
  var housingPrice = document.querySelector('.map__filter[name=housing-price]');
  var housingRooms = document.querySelector('.map__filter[name=housing-rooms]');
  var housingGuests = document.querySelector('.map__filter[name=housing-guests]');
  var housingFeatures = document.querySelectorAll('.map__checkbox');

  var removePins = function () {
    var pins = document.querySelectorAll('.map__pin');
    pins.forEach(function (pin) {
      if (!pin.classList.contains('map__pin--main')) {
        pin.remove();
      }
    });
  };

  var renderPins = function () {
    removePins();
    var fragment = document.createDocumentFragment();

    var currentPins = window.pins;
    currentPins = currentPins.
      filter(function (item) {
        if (housingType.value !== 'any' && item.offer.type !== housingType.value) {
          return false;
        }
        var priceFilter = housingPrice.value;
        var price = item.offer.price;
        switch (priceFilter) {
          case 'any':
            break;
          case 'middle':
            if (price < LOW_PRICE || price > HIGH_PRICE) {
              return false;
            }
            break;
          case 'low':
            if (price > LOW_PRICE) {
              return false;
            }
            break;
          case 'high':
            if (price < HIGH_PRICE) {
              return false;
            }
            break;
          default:
            return false;
        }
        if (housingRooms.value !== 'any' && item.offer.rooms !== +housingRooms.value) {
          return false;
        }
        if (housingGuests.value !== 'any' && item.offer.guests !== +housingGuests.value) {
          return false;
        }
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
      fragment.appendChild(window.pin.createElement(pinsNearArray[i]));
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
    fragment.appendChild(window.card.createElement(card));
    mapElement.insertBefore(fragment, mapFiltersContainer);
  };

  window.map = {
    renderPins: renderPins,
    renderCard: renderCard,
    removePins: removePins,
    removeCard: removeCard
  };
})();
