'use strict';

(function () {
  var PIN_WIDTH = 40;
  var PIN_HEIGHT = 70;
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var create = function (pinElement) {
    var pin = pinTemplate.cloneNode(true);

    pin.style.left = pinElement.location.x - PIN_WIDTH / 2 + 'px';
    pin.style.top = pinElement.location.y - PIN_HEIGHT + 'px';
    pin.querySelector('img').src = pinElement.author.avatar;
    pin.querySelector('img').alt = pinElement.offer.title;

    var clickHandler = function () {
      window.map.renderCard(pinElement);
      pin.classList.add('map__pin--active');
    };
    pin.addEventListener('click', clickHandler);

    var keydownHandler = function (evt) {
      if (evt.key === window.utils.Key.ENTER) {
        window.map.renderCard(pinElement);
        pin.classList.add('map__pin--active');
      }
    };
    pin.addEventListener('keydown', keydownHandler);

    return pin;
  };

  window.pin = {
    create: create
  };
})();
