
class Tile {
  constructor(position, value, type) {
    this.x     = position.x;
    this.y     = position.y;
    this.value = value || 2;

    if (type) {
      this.type    = type;
      this.cssType = GameManager.cssColorMap[type];
    } else {
      var num = Utils.rand(3);
      this.type    = GameManager.getColors[num];
      this.cssType = GameManager.getCSSColors[num];
    }

    this.previousPosition = null;
    this.mergedFrom       = null; // Tracks tiles that merged together
  }

  savePosition() {
    this.previousPosition = { x: this.x, y: this.y };
  }

  updatePosition(position) {
    this.x = position.x;
    this.y = position.y;
  }

  serialize() {
    return {
      position: {
        x: this.x,
        y: this.y
      },
      value: this.value,
      type: this.type,
    }
  }
}
