'use strict';

(function () {
  var TOP_COORDS_LIMIT = 130;
  var BOTTOM_COORDS_LIMIT = 630;
  var map = document.querySelector('.map');
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

  var pinDragAndDropHandler = function (evt) {
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var pinMouseMoveHandler = function (moveEvt) {
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      if (pinMain.style.top.replace('px', '') - shift.y >= TOP_COORDS_LIMIT - window.form.PIN_HEIGHT
        && pinMain.style.top.replace('px', '') - shift.y <= BOTTOM_COORDS_LIMIT - window.form.PIN_HEIGHT
        && pinMain.style.left.replace('px', '') - shift.x >= -window.form.PIN_WIDTH / 2
        && pinMain.style.left.replace('px', '') - shift.x <= map.offsetWidth - window.form.PIN_WIDTH / 2) {

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';
        pinMain.style.left = (pinMain.offsetLeft - shift.x) + 'px';
        window.form.setAddressCoordinates(pinMain.style.left, pinMain.style.top);
      }
    };

    var pinMouseUpHandler = function () {
      map.removeEventListener('mousemove', pinMouseMoveHandler);
      map.removeEventListener('mouseup', pinMouseUpHandler);
    };

    map.addEventListener('mousemove', pinMouseMoveHandler);
    map.addEventListener('mouseup', pinMouseUpHandler);
  };

  var activatePageHandler = function () {
    map.classList.remove('map--faded');
    window.form.setAddressCoordinates(pinMain.style.left, pinMain.style.top);
    formsEnableHandler();
    window.backend.load(window.map.renderPins, window.backend.commonErrorHandler);
    pinMain.addEventListener('mousedown', pinDragAndDropHandler);
  };

  pinMain.addEventListener('mousedown', function (evt) {
    if (evt.button === 0) {
      activatePageHandler();
    }
  });

  pinMain.addEventListener('keydown', function (evt) {
    if (evt.key === window.utils.ENTER_KEY) {
      activatePageHandler();
    }
  });
})();
