
window.urlParams = new URLParams(location);

class GameEvent extends EventEmitter {}
var gameEvent = new GameEvent();
var intro;

window.addEventListener('load', () => {
  gameEvent.emit('game-title');
  intro = gameIntro();

  // --- Init Puzzle ---
  var gameManager1 = new GameManager(1, InputManager, HTMLActuator, gameEvent);
  var gameManager2 = new GameManager(2, InputManager, HTMLActuator, gameEvent);

  if (window.location.hostname === 'localhost') {
    // debug mode
    window.gameManager1 = gameManager1;
    window.gameManager2 = gameManager2;
  }

  // --- Gadget ---
  var htmlGadget = new HTMLGadget(gameEvent);

  // --- Earth Globe ---
  var earthGlobe = new EarthGlobe("#game-background");
  earthGlobe.loop();

  gameEvent.on('game-reset', () => {
    earthGlobe.setDisasterZero();
  });

  window.setDisasterRandom = function () {
    earthGlobe.setDisasterRandom();
  }
  window.setDisasterZero = function () {
    earthGlobe.setDisasterZero();
  }

  if (window.location.hostname === 'localhost') {
    // debug mode
    window.earthGlobe = earthGlobe;
  }

  // --- Progress Bar ---
  var stages = ['PHASE 1', 'PHASE 2', 'PHASE 3', 'PHASE 4', 'PHASE 5', 'PHASE 6'];
  var progress = new ProgressBar(stages, 'PHASE 1', 'progress-bar-wrapper');
  var timeout;
  gameEvent.on('game-start', () => {
    earthGlobe.setDisasterPhase(0);
    timeout = setTimeout((progress) => {
      progress.incrementStage();
      earthGlobe.setDisasterPhase(1);
      timeout = setTimeout((progress) => {
        progress.incrementStage();
        earthGlobe.setDisasterPhase(2);
        timeout = setTimeout((progress) => {
          progress.incrementStage();
          earthGlobe.setDisasterPhase(3);
          timeout = setTimeout((progress) => {
            progress.incrementStage();
            earthGlobe.setDisasterPhase(4);
            timeout = setTimeout((progress) => {
              progress.incrementStage();
              earthGlobe.setDisasterPhase(5);
              timeout = setTimeout((progress) => {
                earthGlobe.setDisasterPhase(6);
                gameEvent.emit('game-over');
              }, 30000, progress);
            }, 30000, progress);
          }, 30000, progress);
        }, 20000, progress);
      }, 20000, progress);
    }, 10000, progress);
  });

  gameEvent.on('game-clear', () => { clearTimeout(timeout); });
  gameEvent.on('game-over',  () => { clearTimeout(timeout); });
  gameEvent.on('game-reset', () => {
    clearTimeout(timeout);
    progress.updateStage('PHASE 1');
  });

  if (window.location.hostname === 'localhost') {
    // debug mode
    window.progress = progress;
  }

  // gameEvent.emit('game-start');
});


// --- Vaccines ---
var createdVaccines = {
  red:    false,
  blue:   false,
  yellow: false,
  green:  false,
};
gameEvent.on('create-vaccine', (type) => {
  if (['red', 'blue', 'yellow', 'green'].indexOf(type) == -1) {
    throw 'Unexpected type';
  }
  createdVaccines[type] = true;
  // Emit game-clear if all vaccine are created.
  var isCreatedAllVaccines = Utils.values(this.createdVaccines).every(x => x);
  if (isCreatedAllVaccines) {
    console.log("game clear!!");
    this.gameEvent.emit('game-clear')
  }
});
gameEvent.on('game-reset', () => {
  createdVaccines = {
    red:    false,
    blue:   false,
    yellow: false,
    green:  false,
  };
});


// Press ESC key to reset game
document.addEventListener('keydown', function (event) {
  if (event.which === 27) { // ESC
    gameEvent.emit('game-reset-transition');
  }
});


gameEvent.on('game-title', () => {
  var gameTitle = document.querySelector('.game-title');
  gameTitle.style.opacity = 1;
  document.addEventListener('keyup', function (event) {
    if (event.which === 39) {
      gameTitle.style.opacity = 0;
      gameTitle.style.transition = 'opacity 500ms ease';
      gameTitle.addEventListener('transitionend', () => {
        gameEvent.emit('game-intro');
        console.log("emit game-intro");
      }, { once: true })
    }
  }, { once: true });
});

gameEvent.on('game-intro', () => {
  intro.start().oncomplete(() => {
    gameEvent.emit('game-countdown');
  });
});
gameEvent.on('game-reset', () => {
  intro.exit();
});

gameEvent.on('game-countdown', () => {
  var gameCountdown = document.querySelector('.game-countdown');
  var gameCountdownText = document.querySelector('.game-countdown .count');
  gameCountdown.style.opacity = 1;
  setTimeout(() => { gameCountdownText.innerText = '4' }, 1000);
  setTimeout(() => { gameCountdownText.innerText = '3' }, 2000);
  setTimeout(() => { gameCountdownText.innerText = '2' }, 3000);
  setTimeout(() => { gameCountdownText.innerText = '1' }, 4000);
  setTimeout(() => {
    gameCountdownText.innerText = 'Start!';
    gameEvent.emit('game-start');
    gameCountdown.style.opacity = 0;
    gameCountdown.style.transition = 'opacity 500ms ease';
  }, 5000);
  setTimeout(() => { gameCountdownText.innerText = '5' }, 7000); // for next game
});


gameEvent.on('game-reset-transition', () => {
  // Animation
});

gameEvent.on('game-reset', () => {
  var gameLoadingWrapper = document.querySelector('.game-loading-wrapper');
  gameLoadingWrapper.style.opacity = 1;
  gameLoadingWrapper.style.transition = 'opacity 500ms ease';
  $('.game-loading').circleProgress({
    size: 200,
    startAngle: -Math.PI / 2,
    value: 1.0,
    animation: { duration: 4000, easing: "circleProgressEasing" },
  }).on('circle-animation-end', () => {
    gameEvent.emit('game-title');
    gameLoadingWrapper.style.opacity = 0;
  })
});
