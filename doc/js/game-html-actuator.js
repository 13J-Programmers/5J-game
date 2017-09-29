
class HTMLActuator {
  constructor(playerID, gameEvent) {
    this.tileContainer      = document.querySelector(".player" + playerID + " .tile-container");
    this.messageContainer   = document.querySelector(".player" + playerID + " .game-message");
    this.terminationMessage = document.querySelector(".player" + playerID + " .game-termination-message");
    this.gameEvent = gameEvent;

    this.gameEvent.on('game-clear', () => {
      this.message({ won: true });
    })
  }

  actuate(grid) {
    var self = this;

    window.requestAnimationFrame(() => {
      // Clear tile container
      while (self.tileContainer.firstChild) {
        self.tileContainer.removeChild(self.tileContainer.firstChild);
      }

      grid.cells.forEach((column) => {
        column.forEach((cell) => {
          if (cell) {
            self.addTile(cell);
          }
        });
      });

      grid.cells.forEach((column) => {
        column.forEach((tile) => {
          if (tile && (tile.pack || tile.syringe)) {
            grid.removeTile(tile); // update grid
          }
        });
      });
    });
  }

  addTile(tile) {
    var self = this;

    var wrapper   = document.createElement("div");
    var inner     = document.createElement("div");
    var position  = tile.previousPosition || { x: tile.x, y: tile.y };
    var positionClass = this.cssPositionClass(position);

    // We can't use classlist because it somehow glitches when replacing classes
    var classes = ["tile"];
    if (tile.syringe) {
      classes.push("tile-" + tile.cssType + "-syringe");
    } else if (tile.pack) {
      classes.push("tile-" + tile.cssType + "-pack");
    } else {
      classes.push("tile-" + tile.cssType + "-" + tile.value);
    }
    classes.push(positionClass);
    if (tile.willDisappear) {
      classes.push("tile-will-disappear");
    }
    this.applyClasses(wrapper, classes);

    inner.classList.add("tile-inner");
    // inner.textContent = tile.value;

    if (tile.previousPosition) {
      // Make sure that the tile gets rendered in the previous position first
      window.requestAnimationFrame(function () {
        classes[2] = self.cssPositionClass({ x: tile.x, y: tile.y });
        self.applyClasses(wrapper, classes); // Update the position
      });
    } else if (tile.mergedFrom) {
      classes.push("tile-merged");
      this.applyClasses(wrapper, classes);

      // Render the tiles that merged
      tile.mergedFrom.forEach(function (merged) {
        self.addTile(merged);
      });
    } else {
      classes.push("tile-new");
      this.applyClasses(wrapper, classes);
    }

    // Add the inner part of the tile to the wrapper
    wrapper.appendChild(inner);

    // Put the tile on the board
    this.tileContainer.appendChild(wrapper);
  }

  applyClasses(element, classes) {
    element.setAttribute("class", classes.join(" "));
  }

  cssPositionClass(pos) {
    pos = { x: pos.x + 1, y: pos.y + 1 };
    return "tile-position-" + pos.x + "-" + pos.y;
  }

  message(args) {
    if (typeof args === undefined) args.won = true;
    var type    = args.won ? "game-won" : "game-over";
    var message = args.won ? "You win!" : "Game over!";

    this.messageContainer.classList.add(type);
    this.messageContainer.getElementsByTagName("p")[0].textContent = message;
  }

  clearMessage() {
    this.messageContainer.classList.remove("game-won");
    this.messageContainer.classList.remove("game-over");
  }

  terminateGame(args) {
    if (typeof args === undefined) args.won = true;
    var type    = args.allWon ? "game-all-won" : "game-all-over";
    var message = args.allWon ? "VICTORY" : "GAME OVER";
    var reason  = args.reason || "";

    this.clearMessage();
    this.terminationMessage.classList.add(type);
    this.terminationMessage.querySelector('h3').textContent = message;
    this.terminationMessage.querySelector('p').textContent  = reason;
  }
}
