
class GameManager {
  constructor(color, InputManager, Actuator) {
    this.size = 4; // Size of the grid
    this.copeWith = color; // color will be virus color (red, blue, green, yellow)
    this.inputManager = new InputManager();
    this.actuator     = new Actuator(color);
    this.startTiles   = 2;

    this.inputManager.on("move", this.move.bind(this));
    this.inputManager.on("restart", this.restart.bind(this));

    this.setup();
  }

  restart() {
    // clear message
    this.setup();
  }

  isGameTerminated() {
    return this.over || this.won;
  }

  setup() {
    this.grid  = new Grid(this.size);
    this.score = 0;
    this.over  = false;
    this.won   = false;

    // Add the initial tiles
    for (var i = 0; i < this.startTiles; i++) {
      this.addRandomTile();
    }

    console.log(this.grid);

    // Update the actuator
    this.actuate();
  }

  // Adds a tile in a random position
  addRandomTile() {
    if (this.grid.hasEmptyCell()) {
      var value = Math.random() < 0.9 ? 2 : 4;
      var tile = new Tile(this.grid.randomAvailableCell(), value);

      this.grid.insertTile(tile);
    }
  }

  // Sends the updated grid to the actuator
  actuate() {
    this.actuator.actuate(this.grid, {
      score:      this.score,
      over:       this.over,
      won:        this.won,
      terminated: this.isGameTerminated()
    });
  }

  // Save all tile positions and remove merger info
  prepareTiles() {
    // TODO:
  }

  // Move tiles on the grid in the specified direction
  move(direction) {
    // 0: up, 1: right, 2: down, 3: left

    if (this.isGameTerminated()) return;

    var vector     = this.getVector(direction);
    var traversals = this.buildTraversals(vector);
    var moved      = false;

    console.log(vector);

    // Save the current tile positions and remove merger information
    this.prepareTiles();

    // Traverse the grid in the right direction and move tiles

    // Extract a packed knowledge and a vaccine

    if (moved) {
      this.addRandomTile();

      if (!this.movesAvailable()) {
        this.over = true;
      }

      this.actuate();
    }
  }

  // Get the vector representing the chosen direction
  getVector(direction) {
    var map = {
      0: { x: 0,  y: -1 }, // Up
      1: { x: 1,  y: 0 },  // Right
      2: { x: 0,  y: 1 },  // Down
      3: { x: -1, y: 0 }   // Left
    };
    return map[direction];
  }

  // Build a list of positions to traverse in the right order
  // ex)
  //     when vector = ( 0, -1) // Up
  //       return { x: [0,1,2,3], y: [0,1,2,3] }
  //     when vector = ( 1,  0) // Right
  //       return { x: [3,2,1,0], y: [0,1,2,3] }
  //     when vector = ( 0,  1) // Down
  //       return { x: [0,1,2,3], y: [3,2,1,0] }
  //     when vector = ( 1,  0) // Left
  //       return { x: [0,1,2,3], y: [0,1,2,3] }
  //
  buildTraversals(vector) {
    var traversals = { x: [], y: [] };

    for (var pos = 0; pos < this.size; pos++) {
      traversals.x.push(pos);
      traversals.y.push(pos);
    }
    // Always traverse from the farthest cell in the chosen direction
    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();
    return traversals;
  }

  findFarthestPosition(cell, vector) {
    var previous;

    // Progress towards the vector direction until an obstacle is found
    do {
      previous = cell;
      cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
    } while (this.grid.withinBounds(cell) &&
             this.grid.cellAvailable(cell));

    return {
      farthest: previous,
      next: cell // Used to check if a merge is required
    };
  }

  movesAvailable() {
    return this.grid.hasEmptyCell() || this.tileMatchesAvailable();
  }

  // Check for available matches between tiles (more expensive check)
  tileMatchesAvailable() {
    var self = this;

    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        var tile = this.grid.cellContent({ x: x, y: y });

        if (tile) {
          for (var direction = 0; direction < 4; direction++) {
            var vector = self.getVector(direction);
            var cell   = { x: x + vector.x, y: y + vector.y };
            var other  = self.grid.cellContent(cell);

            if (other && other.type === tile.type) {
              return true; // These two tiles can be merged
            }
          }
        }
      }
    }
    return false;
  }
}

// Class propaties and class methods

// {red: "pink", blue: "lightblue", green: "lightgreen", yellow: "yellow"}
GameManager.colors    = ["red",  "blue",      "green",      "yellow"];
GameManager.cssColors = ["pink", "lightblue", "lightgreen", "yellow"];
GameManager.cssColorMap = (function () {
  var hash = {};
  for (var i = 0; i < GameManager.colors.length; i++) {
    hash[GameManager.colors[i]] = GameManager.cssColors[i];
  }
  return hash;
}());
