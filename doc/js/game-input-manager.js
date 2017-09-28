
class InputManager extends EventEmitter {
  constructor(playerID) {
    super();
    this.listen(playerID);
  }

  listen(playerID) {
    var self = this;

    var mapping;
    if (playerID === 1) {
      mapping = {
        87: 0, // W
        68: 1, // D
        83: 2, // S
        65: 3, // A
      };
    } else if (playerID === 2) {
      mapping = {
        38: 0, // Up
        39: 1, // Right
        40: 2, // Down
        37: 3, // Left
      }
    } else {
      throw 'Unexpected playerID';
    }

    // Respond to direction keys
    document.addEventListener("keydown", function (event) {
      var modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
      var mapped = mapping[event.which];

      if (!modifiers) {
        if (mapped !== undefined) {
          event.preventDefault();
          self.emit("move", mapped);
        }
      }

      // R key restarts the game
      if (!modifiers && event.which === 82) {
        self.restart.call(self, event);
      }
    });

    // Respond to swipe events
    // TODO:
  }

  restart(event) {
    event.preventDefault();
    this.emit("restart");
  }
}
