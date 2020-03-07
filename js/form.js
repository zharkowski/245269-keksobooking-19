'use strict';

(function () {
  var pinMain = document.querySelector('.map__pin--main');

  var PIN_WIDTH = pinMain.offsetWidth;
  var PIN_HEIGHT = 80;
  var MAX_PRICE = 1000000;

  var form = document.querySelector('.ad-form');
  var resetButton = document.querySelector('.ad-form__reset');
  var rooms = document.querySelector('select[name=rooms]');
  var capacity = document.querySelector('select[name=capacity]');
  var type = document.querySelector('select[name=type]');
  var price = document.querySelector('input[name=price]');
  var timein = document.querySelector('select[name=timein]');
  var timeout = document.querySelector('select[name=timeout]');

  var addressInput = document.querySelector('input[name=address]');
  var setAddressCoordinates = function (xCoord, yCoord) {
    xCoord = String(xCoord).replace('px', '');
    xCoord = Math.round(+xCoord + PIN_WIDTH / 2);
    yCoord = String(yCoord).replace('px', '');
    yCoord = Math.round(+yCoord + PIN_HEIGHT);
    addressInput.setAttribute('value', xCoord + ', ' + yCoord);
  };

  // центром метки по оси Y относительно остного конца будет - координата острого конца минус высота метки плюс радиус круглой метки (половина ширины)
  setAddressCoordinates(pinMain.style.left, pinMain.style.top.replace('px', '') - (PIN_HEIGHT - PIN_WIDTH / 2));

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

  var setPriceValidity = function (offerType) {
    price.setCustomValidity('');
    var minPrice = window.data.minPriceMap[offerType];
    price.placeholder = minPrice;
    if (price.value < minPrice) {
      price.setCustomValidity('Цена для жилья типа "' + window.data.offerTypeMap[offerType] + '" не можеть быть меньше ' + minPrice + ' рублей');
    }
    if (price.value > MAX_PRICE) {
      price.setCustomValidity('Цена для жилья не можеть быть больше 1 000 000 рублей');
    }
  };

  type.addEventListener('change', function () {
    setPriceValidity(type.value);
  });

  price.addEventListener('change', function () {
    setPriceValidity(type.value);
  });

  timein.addEventListener('change', function () {
    timeout.value = timein.value;
  });

  timeout.addEventListener('change', function () {
    timein.value = timeout.value;
  });

  var formSendHandler = function () {
    var showMessage = function (messageType) {
      var messageTemplate = document.querySelector('#' + messageType).content.querySelector('.' + messageType);
      var message = messageTemplate.cloneNode(true);
      document.querySelector('main').appendChild(message);
      document.addEventListener('click', function () {
        message.remove();
      });
      document.addEventListener('keydown', function (evt) {
        if (evt.key === window.utils.ESCAPE_KEY) {
          message.remove();
        }
      });
      var button = document.querySelector('.' + messageType + '__button');
      if (button) {
        button.addEventListener('click', function () {
          message.remove();
        });
      }
    };

    var formSaveSuccessHandler = function () {
      window.pageActivation.deactivatePageHandler();
      showMessage('success');
    };

    var formSaveErrorHandler = function () {
      showMessage('error');
    };

    window.backend.save(new FormData(form), formSaveSuccessHandler, formSaveErrorHandler);
  };

  form.addEventListener('submit', function (evt) {
    formSendHandler();
    evt.preventDefault();
  });

  resetButton.addEventListener('click', function () {
    form.reset();
  });


  window.form = {
    setAddressCoordinates: setAddressCoordinates,
    PIN_WIDTH: PIN_WIDTH,
    PIN_HEIGHT: PIN_HEIGHT
  };
})();
