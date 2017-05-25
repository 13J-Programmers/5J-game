
class HTMLActuator {
  constructor() {
    this.tileContainer        = $(".tile-container");
    this.messageContainer     = $(".game-message");
    this.tileRemovedContainer = $(".tile-removed-container");
  }

  actuate(grid, metadata) {
    window.requestAnimationFrame(() => {
      // clear
      // add tiles
      // remove tile if tile becomes pack or syringe
      // show message if game is terminated
    });
  }

  addTile(tile) {
    var wrapper  = $("<div></div>");
    var inner    = $("<div></div>");
    var position = tile.previousPosition || { x: tile.x, y: tile.y };
    var positionClass = this.cssPositionClass(position);

    // Apply css class to wrapper and inner

    if (tile.previousPosition) {
      // Make sure that the tile gets rendered in the previous position first
      // TODO:
    } else if (tile.mergedFrom) {
      // Render the tiles that merged
      // TODO:
    } else {
      // TODO:
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
