'use strict';

(function () {
  var pinMain = document.querySelector('.map__pin--main');

  var PIN_WIDTH = pinMain.offsetWidth;
  var PIN_HEIGHT = 80;
  var MAX_PRICE = 1000000;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var filtersForm = document.querySelector('.map__filters');
  var form = document.querySelector('.ad-form');
  var resetButton = document.querySelector('.ad-form__reset');
  var rooms = document.querySelector('select[name=rooms]');
  var capacity = document.querySelector('select[name=capacity]');
  var adType = document.querySelector('select[name=type]');
  var price = document.querySelector('input[name=price]');
  var timein = document.querySelector('select[name=timein]');
  var timeout = document.querySelector('select[name=timeout]');
  var avatar = form.querySelector('.ad-form-header__preview img');
  var avatarInput = form.querySelector('.ad-form__field input');
  var adPhotoInput = form.querySelector('.ad-form__input');
  var adPhoto = form.querySelector('.ad-form__photo img');

  var uploadPhoto = function (inputElement, imgElement) {
    var file = inputElement.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imgElement.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  avatarInput.addEventListener('change', function () {
    uploadPhoto(avatarInput, avatar);
  });

  adPhotoInput.addEventListener('change', function () {
    if (!adPhoto) {
      var img = document.createElement('img');
      img.src = '';
      img.alt = 'Фотография жилья';
      img.style.width = '100%';
      img.style.height = '100%';
      form.querySelector('.ad-form__photo').appendChild(img);
      adPhoto = form.querySelector('.ad-form__photo img');
    }
    uploadPhoto(adPhotoInput, adPhoto);
  });

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
      rooms.setCustomValidity('Количество комнат не может быть меньше количества гостей');
      capacity.setCustomValidity('Количество комнат не может быть меньше количества гостей');
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
    if (price.value === '') {
      return;
    }
    if (price.value < minPrice) {
      price.setCustomValidity('Цена для жилья типа "' + window.data.offerTypeMap[offerType] + '" не можеть быть меньше ' + minPrice + ' рублей');
    }
    if (price.value > MAX_PRICE) {
      price.setCustomValidity('Цена для жилья не можеть быть больше 1 000 000 рублей');
    }
  };

  adType.addEventListener('change', function () {
    setPriceValidity(adType.value);
  });

  price.addEventListener('change', function () {
    setPriceValidity(adType.value);
  });

  timein.addEventListener('change', function () {
    timeout.value = timein.value;
  });

  timeout.addEventListener('change', function () {
    timein.value = timeout.value;
  });

  var sendForm = function () {
    var showMessage = function (type) {
      var messageTemplate = document.querySelector('#' + type).content.querySelector('.' + type);
      var message = messageTemplate.cloneNode(true);
      document.querySelector('main').appendChild(message);

      var clickHandler = function () {
        message.remove();
        document.removeEventListener('click', clickHandler);
        document.removeEventListener('keydown', keydownHandler);
      };
      document.addEventListener('click', clickHandler);

      var keydownHandler = function (evt) {
        if (evt.key === window.utils.Key.ESCAPE) {
          message.remove();
        }
        document.removeEventListener('click', clickHandler);
        document.removeEventListener('keydown', keydownHandler);
      };
      document.addEventListener('keydown', keydownHandler);

      var button = document.querySelector('.' + type + '__button');
      if (button) {
        var buttonClickHandler = function () {
          message.remove();
          button.removeEventListener('click', buttonClickHandler);
        };
        button.addEventListener('click', buttonClickHandler);
      }
    };

    var formSaveSuccessHandler = function () {
      window.pageActivation.pageDeactivateHandler();
      showMessage('success');
    };

    var formSaveErrorHandler = function () {
      showMessage('error');
    };

    window.backend.save(new FormData(form), formSaveSuccessHandler, formSaveErrorHandler);
  };

  form.addEventListener('submit', function (evt) {
    sendForm();
    evt.preventDefault();
  });

  var resetFormsHandler = function () {
    form.reset();
    price.placeholder = window.data.minPriceMap[adType.value];
    filtersForm.reset();
  };

  resetButton.addEventListener('click', function () {
    resetFormsHandler();
    window.pageActivation.pageDeactivateHandler();
  });

  var setValidity = function () {
    setPriceValidity(adType.value);
    setRoomsAndCapacityValidity();
  };

  window.form = {
    setValidity: setValidity,
    setAddressCoordinates: setAddressCoordinates,
    PIN_WIDTH: PIN_WIDTH,
    PIN_HEIGHT: PIN_HEIGHT
  };
})();
