
class GameManager {
  constructor(playerID, InputManager, Actuator, gameEvent) {
    this.types        = ["red", "blue", "green", "yellow"];
    this.size         = 4; // Size of the grid
    // color will be virus color (red, blue, green, yellow)
    this.copeWith     = (playerID === 1) ? ["yellow", "red"] : ["green", "blue"];
    this.inputManager = new InputManager(playerID, gameEvent);
    this.actuator     = new Actuator(playerID, gameEvent);
    this.gameEvent    = gameEvent;
    this.startTiles   = 2; // Start tile count
    this.syringeValue = window.urlParams.get('syringeValue') || 30;
    this.packValue    = window.urlParams.get('packValue') || 20;
    this.over         = false; // over: Only this player failed this puzzle.
    this.myVaccine    = []; // The list of vaccine made by this player
    this.receivedKnowledge = 0;

    this.inputManager.on('move', this.move.bind(this));
    this.inputManager.on('restart', this.restart.bind(this));

    this.terminated = false;
    this.gameEvent.on('game-clear', () => {
      this.terminated = true;
    });
    this.gameEvent.on('game-over', () => {
      this.terminated = true;
    });
    this.gameEvent.on('game-reset', () => {
      setTimeout(() => {
        this.terminated = false;
        this.restart();
      }, 1000);
    })

    this.gameEvent.on('create-knowledge', (type) => {
      this.receivedKnowledge += 1;
    });

    this.freesed = true;
    this.gameEvent.on('game-title', () => {
      this.receivedKnowledge = 0;
    })
    this.gameEvent.on('game-start', () => {
      this.freesed = false;
      this.receivedKnowledge = 0;
    });
    this.gameEvent.on('game-reset', () => {
      this.freesed = true;
    });

    this.setup();
  }

  isTerminated() {
    return this.terminated;
  }

  isFreezed() {
    return this.freesed;
  }

  // Restart the game
  restart() {
    if (this.isTerminated()) return; // do nothing when game is terminated.

    this.actuator.clearMessage(); // Clear the game won/lost message
    this.setup();
  }

  // Set up the game
  setup() {
    this.grid  = new Grid(this.size);
    this.score = 0;
    this.over  = false;

    // Add the initial tiles
    for (var i = 0; i < this.startTiles; i++) {
      this.addRandomTile();
    }

    // Update the actuator
    this.actuator.actuate(this.grid);
  }

  // Adds a tile in a random position
  addRandomTile(color) {
    if (this.grid.hasEmptyCell()) {
      // var value = Math.random() < this.receivedKnowledge * 0.1 ? 4 : 2;

      var tile4percentages = [
        0.0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.75, 0.80, 0.85, 0.90, 0.92, 0.94, 0.96, 0.98, 0.99, 1.00];
      var value = 2;
      if (this.receivedKnowledge >= tile4percentages.length) {
        value = 4;
      } else if (Math.random() < tile4percentages[this.receivedKnowledge]) {
        value = 4;
      }
      var tile = new Tile(this.grid.randomAvailableCell(), value, color);

      this.grid.insertTile(tile);
    }
  }

  // Save all tile positions and remove merger info
  prepareTiles() {
    this.grid.eachCell(function (x, y, tile) {
      if (tile) {
        tile.mergedFrom = null;
        tile.savePosition();
      }
    });
  }

  // Move a tile
  moveTile(tile, cell) {
    this.grid.cells[tile.x][tile.y] = null;
    this.grid.cells[cell.x][cell.y] = tile;
    tile.updatePosition(cell);
  }

  // Move tiles on the grid in the specified direction
  move(direction) {
    if (this.isFreezed()) return;
    if (this.isTerminated()) return; // do nothing when game is terminated.

    // 0: up, 1: right, 2: down, 3: left
    var vector     = this.getVector(direction);
    var traversals = this.buildTraversals(vector);
    var moved      = false;

    // Save the current tile positions and remove merger information
    this.prepareTiles();

    // Traverse the grid in the right direction and move tiles
    traversals.x.forEach((x) => {
      traversals.y.forEach((y) => {
        var cell = { x: x, y: y };
        var tile = this.grid.cellContent(cell);

        if (tile) {
          var positions = this.findFarthestPosition(cell, vector);
          var next      = this.grid.cellContent(positions.next);

          if (next && next.type === tile.type/* && !next.mergedFrom */) {
            // Merge tiles
            var merged = new Tile(positions.next, next.value + tile.value, tile.type);
            tile.willDisappear = next.willDisappear = true;
            merged.mergedFrom = [tile, next];

            this.grid.insertTile(merged);
            this.grid.removeTile(tile);

            // Converge the two tiles' positions
            tile.updatePosition(positions.next);

            // Update the score
            //this.score += merged.value;
          } else {
            this.moveTile(tile, positions.farthest);
          }

          if (!this.positionsEqual(cell, tile)) {
            moved = true; // The tile moved from its original cell!
          }
        }
      });
    });

    // Extract a packed knowledge and a vaccine
    traversals.x.forEach((x) => {
      traversals.y.forEach((y) => {
        var cell = { x: x, y: y };
        var tile = this.grid.cellContent(cell);
        if (!tile) return;

        if (this.myVaccine.indexOf(tile.type) >= 0 && tile.value >= this.packValue ||
            this.copeWith.indexOf(tile.type) === -1 && tile.value >= this.packValue) {
          tile.pack = true;
          console.log("Developed knowledge: " + tile.type);
          this.gameEvent.emit('create-knowledge', tile.type);
        } else if (tile.value >= this.syringeValue && this.copeWith.indexOf(tile.type) >= 0) {
          tile.syringe = true;
          this.myVaccine.push(tile.type);
          console.log("Developed vaccine: " + tile.type);
          this.gameEvent.emit('create-vaccine', tile.type);
        }
      })
    });

    if (moved) {
      this.addRandomTile();

      if (!this.movesAvailable()) {
        this.over = true;
        console.log("failed!");
        this.actuator.message({ failed: true }, () => {
          this.restart();
        });
      }

      this.actuator.actuate(this.grid);
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
    return this.grid.hasEmptyCell() || this.hasPackOrSyringe() || this.tileMatchesAvailable();
  }

  hasPackOrSyringe() {
    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        var tile = this.grid.cellContent({ x: x, y: y });
        if (tile && (tile.pack || tile.syringe)) {
          return true;
        }
      }
    }
    return false;
  }

  // Check for available matches between tiles (more expensive check)
  tileMatchesAvailable() {
    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        var tile = this.grid.cellContent({ x: x, y: y });

        if (tile) {
          for (var direction = 0; direction < 4; direction++) {
            var vector = this.getVector(direction);
            var cell   = { x: x + vector.x, y: y + vector.y };
            var other  = this.grid.cellContent(cell);

            if (other && other.type === tile.type) {
              return true; // These two tiles can be merged
            }
          }
        }
      }
    }
    return false;
  }

  positionsEqual(a, b) {
    return a.x === b.x && a.y === b.y;
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
