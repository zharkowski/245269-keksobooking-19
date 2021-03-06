'use strict';

(function () {
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var SAVE_URL = 'https://js.dump.academy/keksobooking';

  var commonErrorHandler = function (wrongXhr) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = '0';
    node.style.right = '0';
    node.style.fontSize = '30px';

    var error = window.utils.CodeMessage[wrongXhr.status];
    node.textContent = error !== undefined ? error : 'Cтатус ответа: ' + wrongXhr.status + ' ' + wrongXhr.statusText;

    document.body.insertAdjacentElement('afterbegin', node);
  };

  var addXhrEvents = function (xhr, loadHandler, errorHandler) {
    xhr.addEventListener('load', function () {
      if (xhr.status === window.utils.StatusCode.OK) {
        loadHandler(xhr.response);
      } else {
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
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open('GET', LOAD_URL);

    addXhrEvents(xhr, loadHandler, errorHandler);

    xhr.send();
  };

  var save = function (data, loadHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open('POST', SAVE_URL);

    addXhrEvents(xhr, loadHandler, errorHandler);

    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save,
    commonErrorHandler: commonErrorHandler
  };
})();
