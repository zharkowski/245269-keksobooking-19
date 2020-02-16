'use strict';

var randomNumber = function (end, start) {
  if (start === undefined) {
    start = 0;
  }
  return start + Math.floor(Math.random() * (end - start));
};

var randomElement = function (array) {
  return array[randomNumber(array.length)];
};

function generatePins(amount) {
  if (amount === undefined) {
    amount = 8;
  }

  var offerTypes = ['palace', 'flat', 'house', 'bungalo'];
  var featuresEnum = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var photos = [];
  var photosAmount = randomNumber(3, 1);
  for (var i = 0; i < photosAmount; i++) {
    photos.push('http://o0.github.io/assets/images/tokyo/hotel' + i + '.jpg');
  }

  var pins = [];
  for (i = 0; i < amount; i++) {
    var pin = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png',
      },
      'offer': {
        'title': 'Предложение ' + i,
        'address': randomNumber(500, 0) + ', ' + randomNumber(630, 130),
        'price': randomNumber(10, 1) * 1000,
        'type': randomElement(offerTypes),
        'rooms': randomNumber(5, 1),
        'guests': randomNumber(10, 1),
        'checkin': '1' + randomNumber(4, 2) + ':00',
        'checkout': '1' + randomNumber(4, 2) + ':00',
        'features': randomElement(featuresEnum),
        'description': 'Описание предложения' + i,
        'photos': photos
      },
      'location': {
        'x': randomNumber(1200, 0),
        'y': randomNumber(630, 130)
      }
    };
    pins.push(pin);
  }
  return pins;
}

var pins = generatePins();

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var pinList = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var createPinElement = function (pinElement) {
  var pin = pinTemplate.cloneNode(true);

  pin.style.left = pinElement.location.x - 20 + 'px';
  pin.style.top = pinElement.location.y - 35 + 'px';
  pin.querySelector('img').src = pinElement.author.avatar;
  pin.querySelector('img').alt = pinElement.offer.title;

  return pin;
};

var createPinsList = function (pinsArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pinsArray.length; i++) {
    fragment.appendChild(createPinElement(pinsArray[i]));
  }
  return fragment;
};

var renderPins = function (pinsElementsList) {
  pinList.appendChild(createPinsList(pinsElementsList));
};

renderPins(pins);
