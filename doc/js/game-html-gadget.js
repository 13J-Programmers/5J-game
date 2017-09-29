
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

    var player1Syringe = document.querySelector('.game-panel.player1 .syringe .background');
    var player2Syringe = document.querySelector('.game-panel.player2 .syringe .background');

    // When developed vaccine
    this.gameEvent.on('create-vaccine', (type) => {
      // Hide virus
      var types = ['red', 'yellow', 'green', 'blue'];
      for (var i = 0; i < types.length; i++) {
        var type_i = types[i];
        if (type_i == type) {
          this.createdVaccines[type] = true;
          var virus = document.querySelector('.game-virus-panel.virus-' + type);
          virus.style.opacity = 0.5;
        }
      }

      // Show game clear if all vaccine are created.
      var isCreatedAllVaccines = Utils.hash2array(this.createdVaccines).every(x => x);
      if (isCreatedAllVaccines) {
        console.log("game clear!!");
        this.gameEvent.emit('game-clear')
      }

      // Update syringe color to highlight
      if (type === 'red') {
        player1Syringe.style.borderTopColor  = 'rgba(255,192,203,1)';
        player1Syringe.style.borderLeftColor = 'rgba(255,192,203,1)';
      }
      else if (type === 'yellow') {
        player1Syringe.style.borderRightColor  = 'rgba(255,255,0,1)';
        player1Syringe.style.borderBottomColor = 'rgba(255,255,0,1)';
      }
      else if (type === 'green') {
        player2Syringe.style.borderTopColor  = 'rgba(144,238,144,1)';
        player2Syringe.style.borderLeftColor = 'rgba(144,238,144,1)';
      }
      else if (type === 'blue') {
        player2Syringe.style.borderRightColor  = 'rgba(173,216,230,1)';
        player2Syringe.style.borderBottomColor = 'rgba(173,216,230,1)';
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
