'use strict';

(function () {
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
    window.form.setAddressCoordinates(pinMain.style.left, pinMain.style.top);
    formsEnableHandler();
    window.map.renderPins(window.pin.pins);
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
