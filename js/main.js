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
var minPriceMap = {
  'palace': 10000,
  'flat': 1000,
  'house': 5000,
  'bungalo': 0
};

function generatePins(amount) {
  var photos = [];
  var photosAmount = randomNumber(3, 1);
  for (var j = 0; j < photosAmount; j++) {
    photos.push('http://o0.github.io/assets/images/tokyo/hotel' + (j + 1) + '.jpg');
  }
  var features = [];
  for (var k = 0; k < randomNumber(featuresEnum.length); k++) {
    if (randomNumber(1, 0) === 1) {
      features.push(featuresEnum[k]);
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
        'address': randomNumber(500, 0) + ', ' + randomNumber(630, 130),
        'price': randomNumber(10, 1) * 1000,
        'type': randomElement(offerTypes),
        'rooms': randomNumber(5, 1),
        'guests': randomNumber(10, 1),
        'checkin': randomElement(checks),
        'checkout': randomElement(checks),
        'features': features,
        'description': 'Описание предложения' + n,
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
for (var k = 0; k < fieldsets.length; k++) {
  fieldsets[k].setAttribute('disabled', '');
}
var filtersForm = document.querySelector('.map__filters');
filtersForm.setAttribute('disabled', '');
var pinMain = document.querySelector('.map__pin--main');

var formsEnableHandler = function () {
  for (var l = 0; l < fieldsets.length; l++) {
    fieldsets[l].removeAttribute('disabled');
  }
  filtersForm.removeAttribute('disabled');
  adForm.classList.remove('ad-form--disabled');
};

// var formsDisableHadler = function () {
//   for (i = 0; i < fieldsets.length; i++) {
//     fieldsets[i].setAttribute('disabled', '');
//   }
//   filtersForm.setAttribute('disabled', '');
// };

// var formsToggle = function () {
//   if (fieldsets[i].disabled) {
//     formsEnableHadler();
//   } else {
//     formsDisableHandler();
//   }
// };

var activatePageHandler = function () {
  var map = document.querySelector('.map');
  map.classList.remove('map--faded');
  setAddressCoordinates(pinMain.style.left, pinMain.style.top);
  formsEnableHandler();
  renderPins(pins);
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
  pin.addEventListener('click', function () {
    renderCard(pinElement);
  });
  pin.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      renderCard(pinElement);
    }
  });

  return pin;
};

var renderPins = function (pinsArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pinsArray.length; i++) {
    fragment.appendChild(createPinElement(pinsArray[i]));
  }
  pinList.appendChild(fragment);
};

var mapElement = document.querySelector('.map');
var mapFiltersContainer = mapElement.querySelector('.map__filters-container');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var createPinCardElement = function (pinElement) {
  var card = cardTemplate.cloneNode(true);

  card.querySelector('.popup__avatar').src = pinElement.author.avatar;
  card.querySelector('.popup__title').textContent = pinElement.offer.title;
  card.querySelector('.popup__text--address').textContent = pinElement.offer.address;
  card.querySelector('.popup__text--price').textContent = pinElement.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = offerTypeMap[pinElement.offer.type];
  card.querySelector('.popup__text--capacity').textContent = pinElement.offer.rooms + ' комнаты для ' + pinElement.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + pinElement.offer.checkin + ', выезд до ' + pinElement.offer.checkout;
  renderFeatures(card, pinElement);
  card.querySelector('.popup__description').textContent = pinElement.offer.description;
  renderPhotos(card, pinElement);

  var closeButton = card.querySelector('.popup__close');
  closeButton.addEventListener('click', function () {
    card.remove();
  });
  document.addEventListener('keydown', function (evt) {
    if (evt.key === 'Escape') {
      card.remove();
    }
  });

  return card;
};

var renderFeatures = function (card, pinElement) {
  var featuresElements = card.querySelectorAll('.popup__feature');
  for (var i = 0; i < featuresElements.length; i++) {
    featuresElements[i].style.display = 'none';
  }
  for (var j = 0; j < pinElement.offer.features.length; j++) {
    card.querySelector('.popup__feature--' + pinElement.offer.features[j]).style.display = 'inline-block';
  }
};

var createPhotos = function (card, pinElement) {
  var fragment = document.createDocumentFragment();
  for (var i = 1; i < pins[0].offer.photos.length; i++) {
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
  var currentCard = mapElement.querySelector('.map__card');
  if (currentCard) {
    currentCard.remove();
  }
  var fragment = document.createDocumentFragment();
  fragment.appendChild(createPinCardElement(card));
  mapElement.insertBefore(fragment, mapFiltersContainer);
};

var rooms = document.querySelector('select[name=rooms]');
var capacity = document.querySelector('select[name=capacity]');

var setRoomsAndCapacityValidity = function () {
  rooms.setCustomValidity('');
  capacity.setCustomValidity('');
  if (+rooms.value < +capacity.value) {
    rooms.setCustomValidity('Количесвто комнат не может быть меньше количства гостей');
    capacity.setCustomValidity('Количесвто комнат не может быть меньше количства гостей');
  }
  if ((+rooms.value === 100 && +capacity.value !== 0) || (+rooms.value !== 100 && +capacity.value === 0)) {
    rooms.setCustomValidity('Данное количество комнат не предназначено для гостей');
    capacity.setCustomValidity('Данное количество комнат не предназначено для гостей');
  }
};

rooms.addEventListener('change', function () {
  setRoomsAndCapacityValidity();
});
capacity.addEventListener('change', function () {
  setRoomsAndCapacityValidity();
});

var type = document.querySelector('select[name=type]');
var price = document.querySelector('input[name=price]');

var setPriceValidity = function (offerType) {
  price.setCustomValidity('');
  var minPrice = minPriceMap[offerType];
  if (price.value < minPrice) {
    price.setCustomValidity('Цена для жилья типа "' + offerTypeMap[offerType] + '" не можеть быть меньше ' + minPrice + ' рублей');
  }
  if (price.value > 1000000) {
    price.setCustomValidity('Цена для жилья не можеть быть больше 1 000 000 рублей');
  }
};

type.addEventListener('change', function () {
  setPriceValidity(type.value);
});

price.addEventListener('change', function () {
  setPriceValidity(type.value);
});

var timein = document.querySelector('select[name=timein]');
var timeout = document.querySelector('select[name=timeout]');

timein.addEventListener('change', function () {
  timeout.value = timein.value;
});

timeout.addEventListener('change', function () {
  timein.value = timeout.value;
});
