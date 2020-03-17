'use strict';

(function () {
  var ENTER_KEY = 'Enter';
  var ESCAPE_KEY = 'Escape';

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
    ENTER_KEY: ENTER_KEY,
    ESCAPE_KEY: ESCAPE_KEY,
    randomNumber: getRandomNumber,
    randomElement: getRandomElement,
    randomUniqueSubArray: getRandomUniqueSubArray
  };
})();
