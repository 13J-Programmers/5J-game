
class InputManager extends EventEmitter {
  constructor(playerID, gameEvent) {
    super();
    this.playerID = playerID;
    this.gameEvent = gameEvent;
    this.freezed = true;

    gameEvent.on('game-title', () => {
      this.freezed = true;
    });
    gameEvent.on('game-start', () => {
      this.freezed = false;
    });
    gameEvent.on('game-reset', () => {
      this.freezed = true;
    });

    this.listenKey(playerID);

    this.gamepadPressed = false; // Avoid that player keeps button pressing.
    setInterval(() => {
      this.listenGamepad(playerID);
    }, 100);
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
      var mapped = mapping[event.keyCode];

      if (!modifiers) {
        if (mapped !== undefined) {
          event.preventDefault();
          self.emit("move", mapped);
        }
      }

      // R key restarts the game
      if (!modifiers && event.keyCode === restartButton) {
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
    if (!gp) return;
    // console.log(gp);
    var xAxis = gp.axes[0].toFixed(4);
    var yAxis = gp.axes[1].toFixed(4);

    if (!this.gamepadPressed &&
        (yAxis <= -1 || this.gamepadButtonPressed(gp.buttons[1]))) {
      this.emit("move", 0);
      if (this.freezed) this.gameEvent.emit("input", playerID, 0);
      this.gamepadPressed = true;
      setTimeout(() => {
        this.gamepadPressed = false;
      }, 200);
    }
    else if (!this.gamepadPressed &&
        (xAxis >= 1 || this.gamepadButtonPressed(gp.buttons[3]))) {
      this.emit("move", 1);
      if (this.freezed) this.gameEvent.emit("input", playerID, 1);
      this.gamepadPressed = true;
      setTimeout(() => {
        this.gamepadPressed = false;
      }, 200);
    }
    else if (!this.gamepadPressed &&
        (yAxis >= 1 || this.gamepadButtonPressed(gp.buttons[2]))) {
      this.emit("move", 2);
      if (this.freezed) this.gameEvent.emit("input", playerID, 2);
      this.gamepadPressed = true;
      setTimeout(() => {
        this.gamepadPressed = false;
      }, 200);
    }
    else if (!this.gamepadPressed &&
        (xAxis <= -1 || this.gamepadButtonPressed(gp.buttons[0]))) {
      this.emit("move", 3);
      if (this.freezed) this.gameEvent.emit("input", playerID, 3);
      this.gamepadPressed = true;
      setTimeout(() => {
        this.gamepadPressed = false;
      }, 200);
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
