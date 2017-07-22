
class HTMLActuator {
  constructor() {
    this.tileContainer        = document.querySelector(".tile-container");
    this.messageContainer     = document.querySelector(".game-message");
    this.tileRemovedContainer = document.querySelector(".tile-removed-container");
  }

  actuate(grid, metadata) {
    var self = this;

    this.metadata = metadata;

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
          if (tile && tile.pack) {
            grid.removeTile(tile); // update grid
          }
        });
      });

      if (metadata.terminated) {
        if (metadata.over) {
          self.message(false); // You lose
        } else if (metadata.won) {
          self.message(true); // You win!
        }
      }
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

  message(won) {
    var type    = won ? "game-won" : "game-over";
    var message = won ? "You win!" : "Game over!";

    this.messageContainer.classList.add(type);
    this.messageContainer.getElementsByTagName("p")[0].textContent = message;
  }

  clearMessage() {}
}
