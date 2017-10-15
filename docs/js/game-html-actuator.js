
class HTMLActuator {
  constructor(playerID, gameEvent) {
    this.playerID = playerID;
    this.tileContainer      = document.querySelector(".player" + playerID + " .tile-container");
    this.animationContainer = document.querySelector(".player" + playerID + " .tile-animation-container");
    this.messageContainer   = document.querySelector(".player" + playerID + " .game-message");
    this.gameEvent = gameEvent;

    this.gameEvent.on('game-clear', () => {
      this.message({ won: true });
      // Break countdown for restart puzzle
      clearTimeout(this.countdownTimeout);
      this.messageContainer.querySelector('span').textContent = "";
    });

    this.gameEvent.on('game-over', () => {
      this.message({ won: false });
      // Break countdown for restart puzzle
      clearTimeout(this.countdownTimeout);
      this.messageContainer.querySelector('span').textContent = "";
    });

    this.gameEvent.on('game-reset', () => {
      // Remove all animated tiles
      while (this.animationContainer.firstChild) {
        this.animationContainer.removeChild(this.animationContainer.firstChild);
      }
    });
  }

  actuate(grid) {
    window.requestAnimationFrame(() => {
      // Clear tile container
      while (this.tileContainer.firstChild) {
        this.tileContainer.removeChild(this.tileContainer.firstChild);
      }

      grid.cells.forEach((column) => {
        column.forEach((cell) => {
          if (cell) {
            this.addTile(cell);
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
      window.requestAnimationFrame(() => {
        classes[2] = this.cssPositionClass({ x: tile.x, y: tile.y });
        this.applyClasses(wrapper, classes); // Update the position
      });
    } else if (tile.mergedFrom) {
      classes.push("tile-merged");
      this.applyClasses(wrapper, classes);

      // Render the tiles that merged
      tile.mergedFrom.forEach((merged) => {
        this.addTile(merged);
      });
    } else {
      classes.push("tile-new");
      this.applyClasses(wrapper, classes);
    }

    // Add the inner part of the tile to the wrapper
    wrapper.appendChild(inner);

    if (tile.syringe || tile.pack) {
      // Put the tile on container for animation
      this.animationContainer.appendChild(wrapper);

      var tileCoordinate = wrapper.getBoundingClientRect();
      var targetCSSSelector = (tile.pack) ? '.game-panel.pack'
                            : '.game-panel.player' + this.playerID + ' .syringe';
      var destCoordinate = document.querySelector(targetCSSSelector).getBoundingClientRect();
      var diffY = destCoordinate.y - tileCoordinate.y;
      var diffX = destCoordinate.x - tileCoordinate.x;
      var moveX = diffX + tile.x * 120;
      var moveY = diffY + tile.y * 120;
      setTimeout(() => {
        wrapper.style.opacity = 0;
        wrapper.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px) scale(0.8, 0.8)';
        wrapper.style.transition = 'transform 1s ease-in, opacity 1s ease-in';
      }, 200);

    } else {
      // Put the tile on the board
      this.tileContainer.appendChild(wrapper);
    }
  }

  applyClasses(element, classes) {
    element.setAttribute("class", classes.join(" "));
  }

  cssPositionClass(pos) {
    pos = { x: pos.x + 1, y: pos.y + 1 };
    return "tile-position-" + pos.x + "-" + pos.y;
  }

  message(args, callback) {
    if (typeof args === undefined) throw 'Unexpected argument';
    var type    = args.won ? "game-won"
                : args.failed ? "game-over"
                : "game-over";
    var message = args.won ? "Mission Complete!"
                : args.failed ? "Oops!"
                : "Game Over!";

    this.messageContainer.classList.add(type);
    this.messageContainer.querySelector('p').textContent = message;

    if (args.failed) {
      this.countdownTimeout = setTimeout(() => {
        this.messageContainer.querySelector('span').textContent = 5;
        this.countdownTimeout = setTimeout(() => {
          this.messageContainer.querySelector('span').textContent = 4;
          this.countdownTimeout = setTimeout(() => {
            this.messageContainer.querySelector('span').textContent = 3;
            this.countdownTimeout = setTimeout(() => {
              this.messageContainer.querySelector('span').textContent = 2;
              this.countdownTimeout = setTimeout(() => {
                this.messageContainer.querySelector('span').textContent = 1;
                this.countdownTimeout = setTimeout(() => {
                  this.messageContainer.querySelector('span').textContent = "";
                  callback();
                }, 1000);
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }
  }

  clearMessage() {
    this.messageContainer.classList.remove("game-won");
    this.messageContainer.classList.remove("game-over");
  }
}
