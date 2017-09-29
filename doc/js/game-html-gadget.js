
class HTMLGadget {
  constructor(gameEvent) {
    this.gameEvent = gameEvent;
    this.createdVaccines = {
      red:    false,
      blue:   false,
      yellow: false,
      green:  false,
    };

    // Restart Game
    this.gameEvent.on('game-restart', () => {
      this.createdVaccines = {
        red:    false,
        blue:   false,
        yellow: false,
        green:  false,
      };
    });

    // When developed vaccine
    this.gameEvent.on('create-vaccine', (type) => {
      var types = ['red', 'yellow', 'green', 'blue'];
      for (var i = 0; i < types.length; i++) {
        var type_i = types[i];
        if (type_i == type) {
          this.createdVaccines[type] = true;
          var virus = document.querySelector('.game-virus-panel.virus-' + type);
          virus.style.opacity = 0.5;
        }
      }

      var isCreatedAllVaccines = Utils.hash2array(this.createdVaccines).every(x => x);
      if (isCreatedAllVaccines) {
        console.log("game clear!!");
        this.gameEvent.emit('game-clear')
      }
    });

    // When developed Knowledge ---
    this.gameEvent.on('create-knowledge', function (type) {
      // TODO: Additional Time
    })
  }

  reset() {
    var types = ['red', 'yellow', 'green', 'blue'];
    for (var i = 0; i < types.length; i++) {
      var type_i = types[i];
      var virus = document.querySelector('.game-virus-panel.virus-' + type);
      virus.style.opacity = 1;
    }
  }
}
