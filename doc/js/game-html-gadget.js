
class HTMLGadget {
  constructor(gameEvent) {
    this.gameEvent = gameEvent;

    this.player1SyringeBackground = document.querySelector('.game-panel.player1 .syringe .background');
    this.player2SyringeBackground = document.querySelector('.game-panel.player2 .syringe .background');
    this.player1Syringe = document.querySelector('.game-panel.player1 .syringe .syringe-image');
    this.player2Syringe = document.querySelector('.game-panel.player2 .syringe .syringe-image');

    // When developed vaccine
    this.gameEvent.on('create-vaccine', (type) => {
      // Hide virus
      if (['red', 'yellow', 'green', 'blue'].indexOf(type) >= 0) {
        var virus = document.querySelector('.game-virus-panel.virus-' + type);
        virus.style.opacity = 0.3;
      }

      if (type == 'red' || type == 'yellow') {
        $(this.player1SyringeBackground).addClass('blink-' + type);
      }
      else if (type == 'green' || type == 'blue') {
        $(this.player2SyringeBackground).addClass('blink-' + type);
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
        $(this.player1Syringe).addClass('syringe-effect');
        console.log("made syringe: " + player);
      }
      else if (player === 'player2') {
        $(this.player2Syringe).addClass('syringe-effect');
        console.log("made syringe: " + player);
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
    this.player1SyringeBackground.style.borderTopColor  = 'rgba(255,192,203,0.1)';
    this.player1SyringeBackground.style.borderLeftColor = 'rgba(255,192,203,0.1)';
    this.player1SyringeBackground.style.borderRightColor  = 'rgba(255,255,0,0.1)';
    this.player1SyringeBackground.style.borderBottomColor = 'rgba(255,255,0,0.1)';
    this.player2SyringeBackground.style.borderTopColor  = 'rgba(144,238,144,0.1)';
    this.player2SyringeBackground.style.borderLeftColor = 'rgba(144,238,144,0.1)';
    this.player2SyringeBackground.style.borderRightColor  = 'rgba(173,216,230,0.1)';
    this.player2SyringeBackground.style.borderBottomColor = 'rgba(173,216,230,0.1)';

    if ($(this.player1SyringeBackground).hasClass('blink-red')) {
      $(this.player1SyringeBackground).removeClass('blink-red');
    }
    if ($(this.player1SyringeBackground).hasClass('blink-yellow')) {
      $(this.player1SyringeBackground).removeClass('blink-yellow');
    }
    if ($(this.player2SyringeBackground).hasClass('blink-green')) {
      $(this.player2SyringeBackground).removeClass('blink-green');
    }
    if ($(this.player2SyringeBackground).hasClass('blink-blue')) {
      $(this.player2SyringeBackground).removeClass('blink-blue');
    }

    if ($(this.player1Syringe).hasClass('syringe-effect')  == true) {
      $(this.player1Syringe).removeClass('syringe-effect');
    }
    if ($(this.player2Syringe).hasClass('syringe-effect')  == true) {
      $(this.player2Syringe).removeClass('syringe-effect');
    }
  }
}
