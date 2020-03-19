'use strict';

(function () {
  var commonErrorHandler = function (wrongXhr) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = '0';
    node.style.right = '0';
    node.style.fontSize = '30px';

    var error;
    switch (wrongXhr.status) {
      case 400:
        error = 'Неверный запрос';
        break;
      case 401:
        error = 'Пользователь не авторизован';
        break;
      case 404:
        error = 'Ошибка подключения к серверу';
        break;
      case 0:
        error = 'Отсутствует подключение к интернету';
        break;
      default:
        error = 'Cтатус ответа: ' + wrongXhr.status + ' ' + wrongXhr.statusText;
    }

    node.textContent = error;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var addXhrEvents = function (xhr, loadHandler, errorHandler) {
    xhr.addEventListener('load', function () {
      try {
        loadHandler(xhr.response);
      } catch (err) {
        errorHandler(xhr);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler(xhr);
    });

    xhr.timeout = 10000;
    xhr.addEventListener('timeout', function () {
      errorHandler(xhr);
    });
  };

  var load = function (loadHandler, errorHandler) {
    var URL = 'https://js.dump.academy/keksobooking/data';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open('GET', URL);

    addXhrEvents(xhr, loadHandler, errorHandler);

    xhr.send();
  };

  var save = function (data, loadHandler, errorHandler) {
    var URL = 'https://js.dump.academy/keksobooking';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open('POST', URL);

    addXhrEvents(xhr, loadHandler, errorHandler);

    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save,
    commonErrorHandler: commonErrorHandler
  };
})();
