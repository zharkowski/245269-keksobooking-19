'use strict';

(function () {
  var NEAR_PINS_AMOUNT = 8;

  function generatePins(amount) {
    var photos = [];
    var photosAmount = window.utils.randomNumber(3, 1);
    for (var j = 0; j < photosAmount; j++) {
      photos.push('http://o0.github.io/assets/images/tokyo/hotel' + (j + 1) + '.jpg');
    }
    var features = [];
    for (var k = 0; k < window.utils.randomNumber(window.data.featuresEnum.length); k++) {
      if (window.utils.randomNumber(1, 0) === 1) {
        features.push(window.data.featuresEnum[k]);
      }
    }

    var pins = [];
    for (var n = 0; n < amount; n++) {
      var pin = {
        'author': {
          'avatar': 'img/avatars/user0' + (n + 1) + '.png',
        },
        'offer': {
          'title': 'Предложение ' + n,
          'address': window.utils.randomNumber(500, 0) + ', ' + window.utils.randomNumber(630, 130),
          'price': window.utils.randomNumber(10, 1) * 1000,
          'type': window.utils.randomElement(window.data.offerTypes),
          'rooms': window.utils.randomNumber(5, 1),
          'guests': window.utils.randomNumber(10, 1),
          'checkin': window.utils.randomElement(window.data.checks),
          'checkout': window.utils.randomElement(window.data.checks),
          'features': features,
          'description': 'Описание предложения' + n,
          'photos': photos
        },
        'location': {
          'x': window.utils.randomNumber(1200, 0),
          'y': window.utils.randomNumber(630, 130)
        }
      };
      pins.push(pin);
    }
    return pins;
  }

  var pins = generatePins(NEAR_PINS_AMOUNT);

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var createPinElement = function (pinElement) {
    var pin = pinTemplate.cloneNode(true);

    pin.style.left = pinElement.location.x - 20 + 'px';
    pin.style.top = pinElement.location.y - 35 + 'px';
    pin.querySelector('img').src = pinElement.author.avatar;
    pin.querySelector('img').alt = pinElement.offer.title;
    pin.addEventListener('click', function () {
      window.map.renderCard(pinElement);
    });
    pin.addEventListener('keydown', function (evt) {
      if (evt.key === window.utils.ENTER_KEY) {
        window.map.renderCard(pinElement);
      }
    });

    return pin;
  };

  window.pin = {
    pins: pins,
    createPinElement: createPinElement
  };
})();
