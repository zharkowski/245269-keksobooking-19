'use strict';

(function () {
  var Key = {
    ENTER: 'Enter',
    ESCAPE: 'Escape'
  };

  var StatusCode = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    NO_CONNECTION: 0
  };

  var CodeMessage = {
    400: 'Неверный запрос',
    401: 'Пользователь не авторизован',
    404: 'Ошибка подключения к серверу',
    0: 'Отсутствует подключение к интернету'
  };

  var getRandomNumber = function (end, start) {
    if (start === undefined) {
      start = 0;
    }
    return Math.floor(start + Math.random() * (end + 1 - start));
  };

  var getRandomElement = function (array) {
    return array[getRandomNumber(array.length - 1)];
  };

  var getRandomUniqueSubArray = function (array, amount) {
    var subArray = [];
    if (array.length <= amount) {
      return array;
    }
    while (subArray.length !== amount) {
      var item = getRandomElement(array);
      if (!subArray.includes(item)) {
        subArray.push(item);
      }
    }
    return subArray;
  };

  window.utils = {
    Key: Key,
    StatusCode: StatusCode,
    CodeMessage: CodeMessage,
    randomNumber: getRandomNumber,
    randomElement: getRandomElement,
    randomUniqueSubArray: getRandomUniqueSubArray
  };
})();
