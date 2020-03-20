'use strict';

(function () {
  var createPhotos = function (card, pinElement) {
    var fragment = document.createDocumentFragment();
    pinElement.offer.photos.forEach(function (photo, index) {
      if (index === 0) {
        return;
      }
      var photoNode = card.querySelector('.popup__photo').cloneNode(true);
      photoNode.src = photo;
      fragment.appendChild(photoNode);
    });
    return fragment;
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

  var renderPhotos = function (card, pinElement) {
    card.querySelector('.popup__photo').src = pinElement.offer.photos[0];
    var photosListElement = card.querySelector('.popup__photos');
    photosListElement.appendChild(createPhotos(card, pinElement));
  };

  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var createElement = function (pinElement) {
    var card = cardTemplate.cloneNode(true);

    card.querySelector('.popup__avatar').src = pinElement.author.avatar;
    card.querySelector('.popup__title').textContent = pinElement.offer.title;
    card.querySelector('.popup__text--address').textContent = pinElement.offer.address;
    card.querySelector('.popup__text--price').textContent = pinElement.offer.price + '₽/ночь';
    card.querySelector('.popup__type').textContent = window.data.offerTypeMap[pinElement.offer.type];
    card.querySelector('.popup__text--capacity').textContent = pinElement.offer.rooms + ' комнаты для ' + pinElement.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + pinElement.offer.checkin + ', выезд до ' + pinElement.offer.checkout;
    renderFeatures(card, pinElement);
    card.querySelector('.popup__description').textContent = pinElement.offer.description;
    renderPhotos(card, pinElement);

    var closeButton = card.querySelector('.popup__close');
    var clickHandler = function () {
      card.remove();
      closeButton.removeEventListener('click', clickHandler);
    };
    closeButton.addEventListener('click', clickHandler);

    var keydownHandler = function (evt) {
      if (evt.key === window.utils.Key.ESCAPE) {
        card.remove();
        document.removeEventListener('keydown', keydownHandler);
      }
    };
    document.addEventListener('keydown', keydownHandler);

    return card;
  };

  window.card = {
    createElement: createElement
  };
})();
