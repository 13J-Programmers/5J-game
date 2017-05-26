
class HTMLActuator {
  constructor() {
    this.tileContainer        = $(".tile-container");
    this.messageContainer     = $(".game-message");
    this.tileRemovedContainer = $(".tile-removed-container");
  }

  actuate(grid, metadata) {
    window.requestAnimationFrame(() => {
      // clear
      this.tileContainer.empty();

      // add tiles
      grid.cells.forEach((column) => {
        column.forEach((cell) => {
          if (cell) {
            this.addTile(cell);
          }
        });
      });

      // remove tile if tile becomes pack or syringe
      // TODO:

      // show message if game is terminated
      if (metadata.terminated) {
        if (metadata.over) {
          this.message(false);
        } else if (metadata.won) {
          this.message(true);
        }
      }
    });
  }

  addTile(tile) {
    var wrapper  = $("<div></div>");
    var inner    = $("<div></div>");
    var position = tile.previousPosition || { x: tile.x, y: tile.y };
    var positionClass = this.cssPositionClass(position);

    // Apply css class to wrapper and inner
    if (tile.syringe) {
      wrapper.addClass("tile-" + tile.cssType + "-syringe");
    } else if (tile.pack) {
      wrapper.addClass("tile-" + tile.cssType + "-pack");
    } else {
      wrapper.addClass("tile-" + tile.cssType + "-" + tile.value);
    }

    inner.addClass("tile-inner");

    if (tile.previousPosition) {
      // Make sure that the tile gets rendered in the previous position first
      window.requestAnimationFrame(function () {
        wrapper.addClass(self.cssPositionClass({ x: tile.x, y: tile.y }));
        // TODO: replace this^ code to dynamic positioning by js
      });
    } else if (tile.mergedFrom) {
      wrapper.addClass("tile-merged");

      // Render the tiles that merged
      tile.mergedFrom.forEach(function (merged) {
        self.addTile(merged);
      });
    } else {
      wrapper.addClass("tile-new");
    }

    // Add the inner part of the tile to the wrapper
    wrapper.append(inner);

    // Put the tile on the board
    this.tileContainer.append(wrapper);
  }

  cssPositionClass(position) {
    position = { x: position.x + 1, y: position.y + 1 };
    return "tile-position-" + position.x + "-" + position.y;
  }

  message(won) {
    var type    = won ? "game-won" : "game-over";
    var message = won ? "You win!" : "Game over!";

    this.messageContainer.addClass(type);
    this.messageContainer.find("p")[0].textContent = message;
  }
}
