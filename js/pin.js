'use strict';

(function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var createElement = function (pinElement) {
    var pin = pinTemplate.cloneNode(true);

    pin.style.left = pinElement.location.x - 20 + 'px';
    pin.style.top = pinElement.location.y - 35 + 'px';
    pin.querySelector('img').src = pinElement.author.avatar;
    pin.querySelector('img').alt = pinElement.offer.title;

    var clickHandler = function () {
      window.map.renderCard(pinElement);
      pin.removeEventListener('click', clickHandler);
    };
    pin.addEventListener('click', clickHandler);

    var keydownHandler = function (evt) {
      if (evt.key === window.utils.ENTER_KEY) {
        window.map.renderCard(pinElement);
        pin.removeEventListener('keydown', keydownHandler);
      }
    };
    pin.addEventListener('keydown', keydownHandler);

    return pin;
  };

  window.pin = {
    createElement: createElement
  };
})();
