
class GameManager {
  constructor(color, InputManager, Actuator) {
    this.size = 4; // Size of the grid
    this.copeWith = color; // color will be virus color (red, blue, green, yellow)
    this.inputManager = new InputManager();
    this.actuator     = new Actuator(color);
    this.startTiles   = 2;

    this.setup();
  }

  setup() {
    //
  }
}
