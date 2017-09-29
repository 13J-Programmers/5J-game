
class Utils {
  static rand(min, max) {
    if (max === undefined) {
      max = min; min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static hash2array(obj) {
    var keys = Object.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };
}
