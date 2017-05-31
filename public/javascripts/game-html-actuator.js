
class HTMLActuator {
  constructor() {
    // this.tileContainer        = $(".tile-container");
    // this.messageContainer     = $(".game-message");
    // this.tileRemovedContainer = $(".tile-removed-container");
    this.tileContainer        = document.querySelector(".tile-container");
    this.messageContainer     = document.querySelector(".game-message");
    this.tileRemovedContainer = document.querySelector(".tile-removed-container");
  }

  actuate(grid, metadata) {
    var self = this;

    window.requestAnimationFrame(() => {
      // Clear tile container
      // self.tileContainer.empty();
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
            self.removeTile(tile); // animate
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

    // var wrapper   = $("<div></div>");
    // var inner     = $("<div></div>");
    var wrapper   = document.createElement("div");
    var inner     = document.createElement("div");
    var position  = tile.previousPosition || { x: tile.x, y: tile.y };
    var positionClass = this.cssPositionClass(position);

    // wrapper.addClass("tile");
    // if (tile.syringe) {
    //   wrapper.addClass("tile-" + tile.cssType + "-syringe");
    // } else if (tile.pack) {
    //   wrapper.addClass("tile-" + tile.cssType + "-pack");
    // } else {
    //   wrapper.addClass("tile-" + tile.cssType + "-" + tile.value);
    // }
    // wrapper.addClass(positionClass);
    //
    // inner.addClass("tile-inner");
    // // inner.textContent = tile.value;

    // We can't use classlist because it somehow glitches when replacing classes
    var classes = ["tile"];
    if (tile.syringe) {
      classes.push("tile-" + tile.cssType + "-syringe");
    } else if (tile.pack) {
      classes.push("tile-" + tile.cssType + "-pack");
    } else if (tile.type === "black") {
      classes.push("tile-" + tile.cssType);
    } else {
      classes.push("tile-" + tile.cssType + "-" + tile.value);
    }
    classes.push(positionClass);
    this.applyClasses(wrapper, classes);

    inner.classList.add("tile-inner");
    // inner.textContent = tile.value;

    if (tile.previousPosition) {
      // Make sure that the tile gets rendered in the previous position first
      window.requestAnimationFrame(function () {
        // wrapper.addClass( self.cssPositionClass({ x: tile.x, y: tile.y }) );
        classes[2] = self.cssPositionClass({ x: tile.x, y: tile.y });
        self.applyClasses(wrapper, classes); // Update the position
      });
    } else if (tile.mergedFrom) {
      // wrapper.addClass("tile-merged");
      classes.push("tile-merged");
      this.applyClasses(wrapper, classes);

      // Render the tiles that merged
      tile.mergedFrom.forEach(function (merged) {
        self.addTile(merged);
      });
    } else {
      // wrapper.addClass("tile-new");
      classes.push("tile-new");
      this.applyClasses(wrapper, classes);
    }

    // Add the inner part of the tile to the wrapper
    // wrapper.append(inner);
    wrapper.appendChild(inner);

    // Put the tile on the board
    // this.tileContainer.append(wrapper);
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

  removeTile(pos) {
    // $(".tile-container").find("." + this.cssPositionClass(pos)).each(function(index, elem) {
    //   if ($(elem).hasClass("tile-merged")) {
    //     $(elem).appendTo(".tile-removed-container");
    //   } else {
    //     $(elem).animate({ opacity: 0 }, 500).promise().then(function () { $(this).remove() })
    //   }
    // });
    //
    // $(".tile-removed-container .tile").each(function(index, elem) {
    //   $(elem).css({ zIndex: "100", position: "fixed" })
    //   $(elem).animate({ top: 0 }, 1000).animate({ opacity: 0 }, 300).promise().then(function () { $(this).remove() })
    // })
  }
}
