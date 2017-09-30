
class Utils {
  static rand(min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static values(obj) {
    var keys = Object.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  }

  // Sample n random values from a array using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If n is not specified, returns a single random element.
  static shuffle(array) {
    var sample = array.slice(0);
    var length = sample.length;
    var last = length - 1;
    for (var index = 0; index < length; index++) {
      var rand = Utils.rand(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample;
  };
}
