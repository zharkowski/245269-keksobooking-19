'use strict';

(function () {
  var NEAR_PINS_AMOUNT = 5;
  var Price = {
    LOW: 10000,
    HIGH: 50000
  };

  var pinList = document.querySelector('.map__pins');
  var filterForm = document.querySelector('.map__filters');
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
    var renderingPins = [];
    for (var i = 0; i < currentPins.length && renderingPins.length < NEAR_PINS_AMOUNT; i++) {
      if (housingType.value !== 'any' && currentPins[i].offer.type !== housingType.value) {
        continue;
      }
      var priceFilter = housingPrice.value;
      var price = currentPins[i].offer.price;
      switch (priceFilter) {
        case 'any':
          break;
        case 'middle':
          if (price < Price.LOW_PRICE || price > Price.HIGH_PRICE) {
            continue;
          }
          break;
        case 'low':
          if (price > Price.LOW_PRICE) {
            continue;
          }
          break;
        case 'high':
          if (price < Price.HIGH_PRICE) {
            continue;
          }
          break;
        default:
          continue;
      }
      if (housingRooms.value !== 'any' && currentPins[i].offer.rooms !== +housingRooms.value) {
        continue;
      }
      if (housingGuests.value !== 'any' && currentPins[i].offer.guests !== +housingGuests.value) {
        continue;
      }
      var housingCheckedFeatures = document.querySelectorAll('.map__checkbox:checked');
      var isFeatureSuited = true;
      for (var k = 0; k < housingCheckedFeatures.length && isFeatureSuited; k++) {
        if (!currentPins[i].offer.features.includes(housingCheckedFeatures[k].value)) {
          isFeatureSuited = false;
          break;
        }
      }
      if (!isFeatureSuited) {
        continue;
      }

      renderingPins.push(currentPins[i]);
    }

    var nearPins = window.utils.getRandomUniqueElements(renderingPins, NEAR_PINS_AMOUNT);
    nearPins.forEach(function (pin) {
      fragment.appendChild(window.pin.create(pin));
    });
    for (var j = 0; j < nearPins.length; j++) {
      fragment.appendChild(window.pin.create(nearPins[j]));
    }

    pinList.appendChild(fragment);
  };

  var mapRenderHandler = window.debounce(function () {
    removeCard();
    renderPins();
  });

  filterForm.addEventListener('change', mapRenderHandler);

  housingFeatures.forEach(function (node) {
    node.addEventListener('change', function () {
      mapRenderHandler();
    });
  });

  var mapElement = document.querySelector('.map');
  var mapFiltersContainer = mapElement.querySelector('.map__filters-container');

  var removeCard = function () {
    var currentCard = mapElement.querySelector('.map__card');
    if (currentCard) {
      document.querySelector('.map__pin--active').classList.remove('map__pin--active');
      currentCard.removeEventListener('click', window.card.clickHandler);
      currentCard.removeEventListener('click', window.card.keydownHandler);
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
