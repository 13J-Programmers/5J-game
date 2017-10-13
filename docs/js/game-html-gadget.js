
class HTMLGadget {
  constructor(gameEvent) {
    this.gameEvent = gameEvent;

    this.player1SyringeBackground = document.querySelector('.game-panel.player1 .syringe .background');
    this.player2SyringeBackground = document.querySelector('.game-panel.player2 .syringe .background');
    this.player1Syringe = document.querySelector('.game-panel.player1 .syringe .syringe-image');
    this.player2Syringe = document.querySelector('.game-panel.player2 .syringe .syringe-image');
    this.packBackground = document.querySelector('.game-panel .pack .background');
    this.packDesc = document.querySelector('.game-panel .pack .pack-image .desc');

    // When developed vaccine
    this.gameEvent.on('create-vaccine', (type) => {
      // Hide virus
      if (['red', 'yellow', 'green', 'blue'].indexOf(type) >= 0) {
        var virus = document.querySelector('.game-virus-panel.virus-' + type);
        virus.style.opacity = 0.3;
      }

      if (type == 'red' || type == 'yellow') {
        this.player1SyringeBackground.classList.add('blink-' + type);
      }
      else if (type == 'green' || type == 'blue') {
        this.player2SyringeBackground.classList.add('blink-' + type);
      }

      // Update syringe color to highlight
      if (type === 'red') {
        this.player1SyringeBackground.style.borderTopColor  = 'rgba(255,192,203,1)';
        this.player1SyringeBackground.style.borderLeftColor = 'rgba(255,192,203,1)';
      }
      else if (type === 'yellow') {
        this.player1SyringeBackground.style.borderRightColor  = 'rgba(255,255,0,1)';
        this.player1SyringeBackground.style.borderBottomColor = 'rgba(255,255,0,1)';
      }
      else if (type === 'green') {
        this.player2SyringeBackground.style.borderTopColor  = 'rgba(144,238,144,1)';
        this.player2SyringeBackground.style.borderLeftColor = 'rgba(144,238,144,1)';
      }
      else if (type === 'blue') {
        this.player2SyringeBackground.style.borderRightColor  = 'rgba(173,216,230,1)';
        this.player2SyringeBackground.style.borderBottomColor = 'rgba(173,216,230,1)';
      }
    });

    // When developed my vaccines
    this.gameEvent.on('finish-player-task', (player) => {
      if (player === 'player1') {
        this.player1Syringe.classList.add('syringe-effect');
      }
      else if (player === 'player2') {
        this.player2Syringe.classList.add('syringe-effect');
      }
    });

    // When developed knowledge
    this.receivedKnowledge = 0;
    this.gameEvent.on('create-knowledge', (type) => {
      this.receivedKnowledge += 1;
      var value = '0%';
      if (this.receivedKnowledge >= this.tile4percentages.length) {
        value = '100%';
        this.packBackground.style.borderColor =
          'rgba(255,255,0,1) rgba(144,238,144,1) rgba(173,216,230,1) rgba(255,192,203,1)';
      } else {
        value = parseInt(this.tile4percentages[this.receivedKnowledge] * 100) + '%';
      }
      this.packDesc.textContent = value;
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
    this.player1SyringeBackground.style.borderTopColor  = 'rgba(255,192,203,0.1)';
    this.player1SyringeBackground.style.borderLeftColor = 'rgba(255,192,203,0.1)';
    this.player1SyringeBackground.style.borderRightColor  = 'rgba(255,255,0,0.1)';
    this.player1SyringeBackground.style.borderBottomColor = 'rgba(255,255,0,0.1)';
    this.player2SyringeBackground.style.borderTopColor  = 'rgba(144,238,144,0.1)';
    this.player2SyringeBackground.style.borderLeftColor = 'rgba(144,238,144,0.1)';
    this.player2SyringeBackground.style.borderRightColor  = 'rgba(173,216,230,0.1)';
    this.player2SyringeBackground.style.borderBottomColor = 'rgba(173,216,230,0.1)';

    if (this.player1SyringeBackground.classList.contains('blink-red')) {
      this.player1SyringeBackground.classList.remove('blink-red');
    }
    if (this.player1SyringeBackground.classList.contains('blink-yellow')) {
      this.player1SyringeBackground.classList.remove('blink-yellow');
    }
    if (this.player2SyringeBackground.classList.contains('blink-green')) {
      this.player2SyringeBackground.classList.remove('blink-green');
    }
    if (this.player2SyringeBackground.classList.contains('blink-blue')) {
      this.player2SyringeBackground.classList.remove('blink-blue');
    }

    if (this.player1Syringe.classList.contains('syringe-effect')) {
      this.player1Syringe.classList.remove('syringe-effect');
    }
    if (this.player2Syringe.classList.contains('syringe-effect')) {
      this.player2Syringe.classList.remove('syringe-effect');
    }

    this.receivedKnowledge = 0;
    this.packBackground.style.borderColor =
      'rgba(255,255,0,0.1) rgba(144,238,144,0.1) rgba(173,216,230,0.1) rgba(255,192,203,0.1)';
    this.packDesc.textContent = '0%';
  }
}
