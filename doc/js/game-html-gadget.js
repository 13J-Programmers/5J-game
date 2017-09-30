
class HTMLGadget {
  constructor(gameEvent) {
    this.gameEvent = gameEvent;

    this.player1Syringe = document.querySelector('.game-panel.player1 .syringe .background');
    this.player2Syringe = document.querySelector('.game-panel.player2 .syringe .background');

    // When developed vaccine
    this.gameEvent.on('create-vaccine', (type) => {
      // Hide virus
      if (['red', 'yellow', 'green', 'blue'].indexOf(type) >= 0) {
        var virus = document.querySelector('.game-virus-panel.virus-' + type);
        virus.style.opacity = 0.3;
      }

      // Update syringe color to highlight
      if (type === 'red') {
        this.player1Syringe.style.borderTopColor  = 'rgba(255,192,203,1)';
        this.player1Syringe.style.borderLeftColor = 'rgba(255,192,203,1)';
      }
      else if (type === 'yellow') {
        this.player1Syringe.style.borderRightColor  = 'rgba(255,255,0,1)';
        this.player1Syringe.style.borderBottomColor = 'rgba(255,255,0,1)';
      }
      else if (type === 'green') {
        this.player2Syringe.style.borderTopColor  = 'rgba(144,238,144,1)';
        this.player2Syringe.style.borderLeftColor = 'rgba(144,238,144,1)';
      }
      else if (type === 'blue') {
        this.player2Syringe.style.borderRightColor  = 'rgba(173,216,230,1)';
        this.player2Syringe.style.borderBottomColor = 'rgba(173,216,230,1)';
      }
    });

    // When developed Knowledge
    this.gameEvent.on('create-knowledge', function (type) {
      // TODO: Additional Time
    });

    this.gameEvent.on('game-reset', () => {
      this.reset();
    });
  }

  reset() {
    // Reset Virus Appearance
    var types = ['red', 'yellow', 'green', 'blue'];
    for (var i = 0; i < types.length; i++) {
      var type = types[i];
      var virus = document.querySelector('.game-virus-panel.virus-' + type);
      virus.style.opacity = 1;
    }

    // Reset Vaccine Appearance
    this.player1Syringe.style.borderTopColor  = 'rgba(255,192,203,0.1)';
    this.player1Syringe.style.borderLeftColor = 'rgba(255,192,203,0.1)';
    this.player1Syringe.style.borderRightColor  = 'rgba(255,255,0,0.1)';
    this.player1Syringe.style.borderBottomColor = 'rgba(255,255,0,0.1)';
    this.player2Syringe.style.borderTopColor  = 'rgba(144,238,144,0.1)';
    this.player2Syringe.style.borderLeftColor = 'rgba(144,238,144,0.1)';
    this.player2Syringe.style.borderRightColor  = 'rgba(173,216,230,0.1)';
    this.player2Syringe.style.borderBottomColor = 'rgba(173,216,230,0.1)';
  }
}
