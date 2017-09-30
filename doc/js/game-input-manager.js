
class InputManager extends EventEmitter {
  constructor(playerID, gameEvent) {
    super();
    this.gameEvent = gameEvent;

    this.listenKey(playerID);

    this.gamepadPressed = false; // Avoid that player keeps button pressing.
    setInterval(() => {
      this.listenGamepad(playerID);
    }, 50);
  }

  listenKey(playerID) {
    var self = this;

    var mapping;
    var restartButton;
    if (playerID === 1) {
      mapping = {
        87: 0, // W
        68: 1, // D
        83: 2, // S
        65: 3, // A
      };
      restartButton = 82;
    } else if (playerID === 2) {
      mapping = {
        38: 0, // Up
        39: 1, // Right
        40: 2, // Down
        37: 3, // Left
      }
      restartButton = 84;
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
      if (!modifiers && event.which === restartButton) {
        self.restart.call(self, event);
      }
    });
  }

  listenGamepad(playerID) {
    var gamepadID = playerID - 1;
    var gamepads = navigator.getGamepads ? navigator.getGamepads()
                 : navigator.webkitGetGamepads ? navigator.webkitGetGamepads
                 : [];
    if (!gamepads) return;
    if (gamepads.length < playerID) return;

    // Gamepad
    //
    //        |-1              1
    //        |            0  (X)  3
    //    ----+----x      (Y)     (A)
    //   -1   |    1          (B)
    //        y 1              2
    //

    var gp = gamepads[gamepadID];
    // console.log(gp);
    var xAxis = gp.axes[0].toFixed(4);
    var yAxis = gp.axes[1].toFixed(4);

    if (this.gamepadPressed) {
      if (this.gamepadNokeyPressed(gp)) {
        this.gamepadPressed = false;
      }
      return;
    }

    if (yAxis <= -1 || this.gamepadButtonPressed(gp.buttons[1])) {
      this.emit("move", 0);
      this.gamepadPressed = true;
    }
    else if (xAxis >= 1 || this.gamepadButtonPressed(gp.buttons[3])) {
      this.emit("move", 1);
      this.gamepadPressed = true;
    }
    else if (yAxis >= 1 || this.gamepadButtonPressed(gp.buttons[2])) {
      this.emit("move", 2);
      this.gamepadPressed = true;
    }
    else if (xAxis <= -1 || this.gamepadButtonPressed(gp.buttons[0])) {
      this.emit("move", 3);
      this.gamepadPressed = true;
    }

  }

  gamepadNokeyPressed(gp) {
    var xAxis = gp.axes[0].toFixed(4);
    var yAxis = gp.axes[1].toFixed(4);
    return (
      Math.round(xAxis) === 0 &&
      Math.round(yAxis) === 0 &&
      !this.gamepadButtonPressed(gp.buttons[0]) &&
      !this.gamepadButtonPressed(gp.buttons[1]) &&
      !this.gamepadButtonPressed(gp.buttons[2]) &&
      !this.gamepadButtonPressed(gp.buttons[3])
    )
  }

  gamepadButtonPressed(b) {
    if (typeof(b) == "object") {
      return b.pressed;
    }
    return b == 1.0;
  }

  restart(event) {
    event.preventDefault();
    this.emit("restart"); // Emit to current puzzle manager, not to global
  }
}