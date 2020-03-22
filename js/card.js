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
    if (pinElement.offer.features.length === 0) {
      var featuresList = card.querySelector('.popup__features');
      featuresList.remove();
    }
    var featuresElements = card.querySelectorAll('.popup__feature');
    for (var i = 0; i < featuresElements.length; i++) {
      featuresElements[i].style.display = 'none';
    }
    for (var j = 0; j < pinElement.offer.features.length; j++) {
      card.querySelector('.popup__feature--' + pinElement.offer.features[j]).style.display = 'inline-block';
    }
  };

  var renderPhotos = function (card, pinElement) {
    var photosListElement = card.querySelector('.popup__photos');
    if (pinElement.offer.photos.length === 0) {
      photosListElement.remove();
      return;
    }
    card.querySelector('.popup__photo').src = pinElement.offer.photos[0];
    photosListElement.appendChild(createPhotos(card, pinElement));
  };

  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var createElement = function (pinElement) {
    var card = cardTemplate.cloneNode(true);
    var avatar = card.querySelector('.popup__avatar');
    var title = card.querySelector('.popup__title');
    var address = card.querySelector('.popup__text--address');
    var price = card.querySelector('.popup__text--price');
    var type = card.querySelector('.popup__type');
    var capacity = card.querySelector('.popup__text--capacity');
    var time = card.querySelector('.popup__text--time');
    var description = card.querySelector('.popup__description');

    if (!pinElement.author.avatar) {
      avatar.remove();
    } else {
      avatar.src = pinElement.author.avatar;
    }
    if (!pinElement.offer.title) {
      title.remove();
    } else {
      title.textContent = pinElement.offer.title;
    }
    if (!pinElement.offer.address) {
      address.remove();
    } else {
      address.textContent = pinElement.offer.address;
    }
    if (!pinElement.offer.price) {
      price.remove();
    } else {
      price.textContent = pinElement.offer.price + '₽/ночь';
    }
    if (!window.data.offerTypeMap[pinElement.offer.type]) {
      type.remove();
    } else {
      type.textContent = window.data.offerTypeMap[pinElement.offer.type];
    }
    if (pinElement.offer.guests === undefined || pinElement.offer.rooms === undefined) {
      capacity.remove();
    } else {
      capacity.textContent = pinElement.offer.guests === 0 ?
        'Не для гостей' :
        pinElement.offer.rooms + ' комнаты для ' + pinElement.offer.guests + ' гостей';
    }
    if (!pinElement.offer.checkin || !pinElement.offer.checkout) {
      time.remove();
    } else {
      time.textContent = 'Заезд после ' + pinElement.offer.checkin + ', выезд до ' + pinElement.offer.checkout;
    }

    renderFeatures(card, pinElement);

    if (!pinElement.offer.description) {
      description.remove();
    } else {
      description.textContent = pinElement.offer.description;
    }
    renderPhotos(card, pinElement);

    var closeButton = card.querySelector('.popup__close');
    var clickHandler = function () {
      card.remove();
      document.querySelector('.map__pin--active').classList.remove('map__pin--active');
      closeButton.removeEventListener('click', clickHandler);
    };
    closeButton.addEventListener('click', clickHandler);
    window.card.clickHandler = clickHandler;

    var keydownHandler = function (evt) {
      if (evt.key === window.utils.Key.ESCAPE) {
        card.remove();
        document.querySelector('.map__pin--active').classList.remove('map__pin--active');
        document.removeEventListener('keydown', keydownHandler);
      }
    };
    document.addEventListener('keydown', keydownHandler);
    window.card.keydownHandler = keydownHandler;

    return card;
  };

  window.card = {
    createElement: createElement
  };
})();
