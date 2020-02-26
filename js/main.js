'use strict';

var NEAR_PINS_AMOUNT = 8;
var PIN_WIDTH = 60;
var PIN_HEIGHT = 80;

var randomNumber = function (end, start) {
  if (start === undefined) {
    start = 0;
  }
  return Math.floor(start + Math.random() * (end + 1 - start));
};

var randomElement = function (array) {
  return array[randomNumber(array.length - 1)];
};

var offerTypes = ['palace', 'flat', 'house', 'bungalo'];
var featuresEnum = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var checks = ['12:00', '13:00', '14:00'];
var offerTypeMap = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

function generatePins(amount) {
  var photos = [];
  var photosAmount = randomNumber(3, 1);
  for (var i = 0; i < photosAmount; i++) {
    photos.push('http://o0.github.io/assets/images/tokyo/hotel' + (i + 1) + '.jpg');
  }
  var features = [];
  for (i = 0; i < randomNumber(featuresEnum.length); i++) {
    if (randomNumber(1, 0) === 1) {
      features.push(featuresEnum[i]);
    }
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
        'checkin': randomElement(checks),
        'checkout': randomElement(checks),
        'features': features,
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

var pins = generatePins(NEAR_PINS_AMOUNT);

var addressInput = document.querySelector('input[name=address]');
var setAddressCoordinates = function (xCoord, yCoord) {
  xCoord = String(xCoord).replace('px', '');
  xCoord = +xCoord + PIN_WIDTH / 2;
  yCoord = String(yCoord).replace('px', '');
  yCoord = +yCoord + PIN_HEIGHT;
  addressInput.setAttribute('value', xCoord + ', ' + yCoord);
};

var adForm = document.querySelector('.ad-form');
adForm.classList.add('ad-form--disabled');
var fieldsets = document.querySelectorAll('fieldset');
for (var i = 0; i < fieldsets.length; i++) {
  fieldsets[i].setAttribute('disabled', '');
}
var filtersForm = document.querySelector('.map__filters');
filtersForm.setAttribute('disabled', '');
var pinMain = document.querySelector('.map__pin--main');

var activatePageHandler = function () {
  var map = document.querySelector('.map');
  map.classList.remove('map--faded');
  setAddressCoordinates(pinMain.style.left, pinMain.style.top);
  for (i = 0; i < fieldsets.length; i++) {
    fieldsets[i].removeAttribute('disabled');
  }
  filtersForm.removeAttribute('disabled');
  renderPins(pins);
  renderCard(pins[0]);
};

// центром метки по оси Y относительно остного конца будет - координата острого конца минус высота метки плюс радиус круглой метки (половина ширины)
setAddressCoordinates(pinMain.style.left, pinMain.style.top.replace('px', '') - (PIN_HEIGHT - PIN_WIDTH / 2));

pinMain.addEventListener('mousedown', function (evt) {
  if (evt.button === 0) {
    activatePageHandler();
  }
});

pinMain.addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter') {
    activatePageHandler();
  }
});

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

var renderPins = function (pinsArray) {
  var fragment = document.createDocumentFragment();
  for (i = 0; i < pinsArray.length; i++) {
    fragment.appendChild(createPinElement(pinsArray[i]));
  }
  pinList.appendChild(fragment);
};

var mapElement = document.querySelector('.map');
var mapFiltersContainer = mapElement.querySelector('.map__filters-container');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var createPinCardElement = function (pinElement) {
  var card = cardTemplate.cloneNode(true);

  card.querySelector('.popup__title').textContent = pinElement.offer.title;
  card.querySelector('.popup__text--address').textContent = pinElement.offer.address;
  card.querySelector('.popup__text--price').textContent = pinElement.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = offerTypeMap[pinElement.offer.type];
  card.querySelector('.popup__text--capacity').textContent = pinElement.offer.rooms + ' комнаты для ' + pinElement.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + pinElement.offer.checkin + ', выезд до ' + pinElement.offer.checkout;
  renderFeatures(card, pinElement);
  card.querySelector('.popup__description').textContent = pinElement.offer.description;
  renderPhotos(card, pinElement);

  return card;
};

var renderFeatures = function (card, pinElement) {
  var featuresElements = card.querySelectorAll('.popup__feature');
  for (i = 0; i < featuresElements.length; i++) {
    featuresElements[i].style.display = 'none';
  }
  for (i = 0; i < pinElement.offer.features.length; i++) {
    card.querySelector('.popup__feature--' + pinElement.offer.features[i]).style.display = 'inline-block';
  }
};

var createPhotos = function (card, pinElement) {
  var fragment = document.createDocumentFragment();
  for (i = 1; i < pins[0].offer.photos.length; i++) {
    var photo = card.querySelector('.popup__photo').cloneNode(true);
    photo.src = pinElement.offer.photos[i];
    fragment.appendChild(photo);
  }
  return fragment;
};

var renderPhotos = function (card, pinElement) {
  card.querySelector('.popup__photo').src = pinElement.offer.photos[0];
  var photosListElement = card.querySelector('.popup__photos');
  photosListElement.appendChild(createPhotos(card, pinElement));
};

var renderCard = function (card) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(createPinCardElement(card));
  mapElement.insertBefore(fragment, mapFiltersContainer);
};

var rooms = document.querySelector('select[name=rooms]');
var capacity = document.querySelector('select[name=capacity]');

var setSelectValidity = function () {
  rooms.setCustomValidity('');
  capacity.setCustomValidity('');
  if (+rooms.value < +capacity.value) {
    rooms.setCustomValidity('Количесвто комнат не может быть меньше количства гостей');
    capacity.setCustomValidity('Количесвто комнат не может быть меньше количства гостей');
  }
};

rooms.addEventListener('change', function () {
  setSelectValidity();
});

capacity.addEventListener('change', function () {
  setSelectValidity();
});
