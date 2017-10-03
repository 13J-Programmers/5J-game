
window.urlParams = new URLParams(location);

class GameEvent extends EventEmitter {}
var gameEvent = new GameEvent();
var intro;

window.addEventListener('load', () => {
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

  // --- Progress ---
  var timeout;
  var interval = window.urlParams.get('phaseInterval') || 30000;
  var intervals = [interval, interval, interval, interval, interval, 5000];
  gameEvent.on('game-start', () => {
    earthGlobe.setDisasterPhase(0);
    progress.incrementStage(intervals[0]);
    timeout = setTimeout(() => {
      earthGlobe.setDisasterPhase(1);
      progress.incrementStage(intervals[1]);
      timeout = setTimeout(() => {
        earthGlobe.setDisasterPhase(2);
        progress.incrementStage(intervals[2]);
        timeout = setTimeout(() => {
          earthGlobe.setDisasterPhase(3);
          progress.incrementStage(intervals[3]);
          timeout = setTimeout(() => {
            earthGlobe.setDisasterPhase(4);
            progress.incrementStage(intervals[4]);
            timeout = setTimeout(() => {
              earthGlobe.setDisasterPhase(5);
              timeout = setTimeout(() => {
                earthGlobe.setDisasterPhase(6);
                gameEvent.emit('game-over');
              }, intervals[5]);
            }, intervals[4]);
          }, intervals[3]);
        }, intervals[2]);
      }, intervals[1]);
    }, intervals[0]);
  });
  gameEvent.on('game-clear', () => { clearTimeout(timeout); });
  gameEvent.on('game-over',  () => { clearTimeout(timeout); });
  gameEvent.on('game-reset', () => {
    clearTimeout(timeout);
    progress.updateStage('PHASE 1', 100);
  });

  if (window.location.hostname === 'localhost') {
    // debug mode
    window.progress = progress;
  }


  // --- Vaccines ---
  var createdVaccines = { red: 0, blue: 0, yellow: 0, green: 0 };
  gameEvent.on('create-vaccine', (type) => {
    if (['red', 'blue', 'yellow', 'green'].indexOf(type) == -1) {
      throw 'Unexpected type';
    }
    createdVaccines[type] += 1;
    // Emit game-clear if all vaccine are created.
    var isCreatedAllVaccines = Utils.values(createdVaccines).every(x => x > 0);
    if (isCreatedAllVaccines) {
      console.log("game clear!!");
      this.gameEvent.emit('game-clear')
    }
  });
  gameEvent.on('game-reset', () => {
    createdVaccines = { red: 0, blue: 0, yellow: 0, green: 0 };
  });


  // --- Knowledge ---
  var createdKnowledge = { red: 0, blue: 0, yellow: 0, green: 0 };
  gameEvent.on('create-knowledge', (type) => {
    createdKnowledge[type] += 1;
  });
  gameEvent.on('game-reset', () => {
    createdKnowledge = { red: 0, blue: 0, yellow: 0, green: 0 };
  });


  // Press ESC key to reset game
  document.addEventListener('keydown', function (event) {
    if (event.which === 27) { // ESC
      gameEvent.emit('game-reset-transition');
    }
  });


  // --- Game Title ---
  gameEvent.on('game-title', () => {
    var gameTitle = document.querySelector('.game-title');
    gameTitle.style.opacity = 1;
    gameTitle.style.transition = 'opacity 500ms ease';

    document.addEventListener('keyup', listener);

    function listener(event) {
      // Right arrow or A
      if (event.which === 39 || event.which === 65) {
        gameTitle.style.opacity = 0;
        gameTitle.addEventListener('transitionend', () => {
          gameEvent.emit('game-intro');
          console.log('emit: game-intro');
        }, { once: true });
        document.removeEventListener('keyup', listener);
      }
      else if (event.which === 27) { // ESC
        gameTitle.style.opacity = 0;
        document.removeEventListener('keyup', listener);
      }
    }
  });

  // --- Game Introduction ---
  gameEvent.on('game-intro', () => {
    intro.start()
    intro.oncomplete(() => {
      gameEvent.emit('game-countdown');
    });
  });
  gameEvent.on('game-reset', () => {
    intro.exit();
  });

  // --- Game Countdown until Start ---
  var timeout;
  var gameCountdown = document.querySelector('.game-countdown');
  var gameCountdownText = document.querySelector('.game-countdown .count');
  gameCountdown.style.transition = 'opacity 500ms ease';
  gameEvent.on('game-countdown', () => {
    gameCountdown.style.opacity = 1;
    timeout = setTimeout(() => {
      gameCountdownText.innerText = '4';
      timeout = setTimeout(() => {
        gameCountdownText.innerText = '3';
        timeout = setTimeout(() => {
          gameCountdownText.innerText = '2';
          timeout = setTimeout(() => {
            gameCountdownText.innerText = '1';
            timeout = setTimeout(() => {
              gameCountdownText.innerText = 'Start!';
              console.log('emit: game-start');
              gameEvent.emit('game-start');
              gameCountdown.style.opacity = 0;
              setTimeout(() => {
                gameCountdownText.innerText = '5'; // for next game
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  });
  gameEvent.on('game-reset', () => {
    clearTimeout(timeout);
    gameCountdown.style.opacity = 0;
    setTimeout(() => {
      gameCountdownText.innerText = '5'; // for next game
    }, 1000);
  });

  // --- Game Clear and Game Over ---
  gameEvent.on('game-clear', () => { gameEvent.emit('game-result'); });
  gameEvent.on('game-over',  () => { gameEvent.emit('game-result'); });

  // --- Game Result ---
  var gameResult = new GameResult(gameEvent);
  var startTime;
  var timeoutGameResult;
  var resetListener = function (event) {
    // Right arrow or A
    if (event.which === 39 || event.which === 65) {
      console.log('emit: game-reset-transition');
      gameEvent.emit('game-reset-transition');
    }
  }
  gameEvent.on('game-start', () => {
    startTime = Date.now();
  });
  gameEvent.on('game-result', () => {
    var elapsedTime = Date.now() - startTime;
    timeoutGameResult = setTimeout(() => {
      gameResult.show(createdVaccines, createdKnowledge, elapsedTime);

      document.addEventListener('keyup', resetListener);
    }, 5000);
  });
  gameEvent.on('game-reset', () => {
    clearTimeout(timeoutGameResult);
    document.removeEventListener('keyup', resetListener);
  });
  gameEvent.on('game-reset-transition', () => {
    clearTimeout(timeoutGameResult);
    document.removeEventListener('keyup', resetListener);
  });

  // --- Game Reset Transition ---
  gameEvent.on('game-reset-transition', () => {
    // Reset game parameters
    setTimeout(() => {
      gameEvent.emit('game-reset');
    }, 1000);

    // Transition Animation
    var gameLoadingWrapper = document.querySelector('.game-loading-wrapper');
    gameLoadingWrapper.style.opacity = 1;
    gameLoadingWrapper.style.transition = 'opacity 500ms ease';
    $('.game-loading').circleProgress({
      size: 200,
      startAngle: -Math.PI / 2,
      value: 1.0,
      animation: { duration: 3000, easing: "circleProgressEasing" },
    }).on('circle-animation-end', function () {
      // console.log('emit: game-title');
      gameEvent.emit('game-title');
      gameLoadingWrapper.style.opacity = 0;
      $(this).unbind('circle-animation-end');
    });
  });


  gameEvent.emit('game-title'); // important!
});
