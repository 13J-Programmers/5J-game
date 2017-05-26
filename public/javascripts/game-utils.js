
class Utils {
  static rand(min, max) {
    if (max === undefined) {
      max = min; min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
