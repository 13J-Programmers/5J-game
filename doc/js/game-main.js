
window.urlParams = new URLParams(location);

class GameEvent extends EventEmitter {}
var gameEvent = new GameEvent();
var intro;
var introMiddle;
var introLast;

window.addEventListener('load', () => {
  intro = gameIntro();
  introMiddle = gameIntroMiddle();
  introLast = gameIntroLast();

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
  gameEvent.on('game-clear', () => {
    clearTimeout(timeout);
    progress.stopAnimation();
  });
  gameEvent.on('game-over', () => {
    clearTimeout(timeout);
  });
  gameEvent.on('game-reset', () => {
    clearTimeout(timeout);
    progress.stopAnimation();
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
    if (event.keyCode === 27) { // ESC
      gameEvent.emit('game-reset-transition');
    }
  });


  // --- Game Title ---
  gameEvent.on('game-title', () => {
    var gameTitle = document.querySelector('.game-title');
    gameTitle.style.opacity = 1;
    // $('.game-window').addClass('blur');
    gameTitle.style.transition = 'opacity 500ms ease';

    document.addEventListener('keyup', listener);

    function listener(event) {
      // Right arrow or A or D
      if (event.keyCode === 39 || event.keyCode === 65 || event.keyCode === 68) {
        gameTitle.style.opacity = 0;
        // $('.game-window').removeClass('blur');
        gameTitle.addEventListener('transitionend', () => {
          gameEvent.emit('game-intro');
          console.log('emit: game-intro');
        }, { once: true });
        document.removeEventListener('keyup', listener);
      }
      // Up arrow or W or X
      else if (event.keyCode === 38 || event.keyCode === 87 || event.keyCode === 88) {
        console.log("selected hard mode!");
      }
      else if (event.keyCode === 27) { // ESC
        gameTitle.style.opacity = 0;
        // $('.game-window').removeClass('blur');
        document.removeEventListener('keyup', listener);
      }
    }
  });

  // --- Game Introduction ---
  gameEvent.on('game-intro', () => {
    intro.start()
    intro.oncomplete(() => {
      introMiddle.start();
      setTimeout(() => {
        document.addEventListener('keyup', chardinExitListener);
      }, 500);
    });
  });
  function chardinExitListener(event) {
    event.stopPropagation();
    // Space or Right arrow
    if (event.keyCode === 32 || event.keyCode === 39) {
      introMiddle.stop();
      introLast.start();
      introLast.oncomplete(() => {
        gameEvent.emit('game-countdown');
      });
      document.removeEventListener('keyup', chardinExitListener);
    }
  }
  gameEvent.on('game-reset', () => {
    intro.exit();
    introLast.exit();
    document.removeEventListener('keyup', chardinExitListener);
    introMiddle.stop();
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
    if (event.keyCode === 39 || event.keyCode === 65) {
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
      // $('.game-window').addClass('blur');

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

  // --- Gamepad ---
  gameEvent.on('input', (playerID, direction) => {
    var mapping = {
      0: 38, // Up
      1: 39, // Right
      2: 40, // Down
      3: 37, // Left
      4: 87, // W
      5: 68, // D
      6: 83, // S
      7: 65, // A
    };
    var key = mapping[direction + (playerID - 1) * 4];
    Utils.triggerKeyboardEvent(document, 'keyup', { keyCode: key });
  });

  // --- Audio ---
  var audioPuzzle = new Audio('bgm/puzzle-nc144385.mp3');
  audioPuzzle.volume = 0.6;
  var audioFadeout = function (audio) {
    setTimeout(() => { audio.volume = 0.5; }, 100);
    setTimeout(() => { audio.volume = 0.4; }, 200);
    setTimeout(() => { audio.volume = 0.3; }, 300);
    setTimeout(() => { audio.volume = 0.2; }, 400);
    setTimeout(() => { audio.volume = 0.1; }, 500);
    setTimeout(() => {
      audio.volume = 0.0;
      audio.pause();
      audio.currentTime = 0;
    }, 600);
  }
  gameEvent.on('game-start', () => {
    audioPuzzle.volume = 0.6;
    audioPuzzle.play();
  });
  gameEvent.on('game-result', () => {
    audioFadeout(audioPuzzle);
  });
  gameEvent.on('game-reset', () => {
    audioFadeout(audioPuzzle);
  });


  gameEvent.emit('game-title'); // important!
});
