'use strict';

(function () {
  var ENTER_KEY = 'Enter';
  var ESCAPE_KEY = 'Escape';

  var randomNumber = function (end, start) {
    if (start === undefined) {
      start = 0;
    }
    return Math.floor(start + Math.random() * (end + 1 - start));
  };

  var randomElement = function (array) {
    return array[randomNumber(array.length - 1)];
  };

  var randomUniqueSubArray = function (array, amount) {
    var subArray = [];
    while (subArray.length !== amount) {
      var item = randomElement(array);
      if (!subArray.includes(item)) {
        subArray.push(item);
      }
    }
    return subArray;
  };

  window.utils = {
    ENTER_KEY: ENTER_KEY,
    ESCAPE_KEY: ESCAPE_KEY,
    randomNumber: randomNumber,
    randomElement: randomElement,
    randomUniqueSubArray: randomUniqueSubArray
  };
})();
