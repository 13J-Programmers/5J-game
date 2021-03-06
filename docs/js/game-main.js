
window.urlParams = new URLParams(location);

class GameEvent extends EventEmitter {}
var gameEvent = new GameEvent();

window.addEventListener('load', () => {
  var intro = gameIntro();

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
  htmlGadget.tile4percentages = gameManager1.tile4percentages; // copy

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
  var stages = ['PHASE 2', 'PHASE 3', 'PHASE 4', 'PHASE 5', 'PHASE 6', 'PANDEMIC'];
  var progress = new ProgressBar(stages, 'PHASE 2', 'progress-bar-wrapper');

  // --- Progress ---
  var timeout;
  var intervals = [26600, 27400, 27500, 27500, 29000, 5000];
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
              gameEvent.emit('game-over');
              timeout = setTimeout(() => {
                earthGlobe.setDisasterPhase(6);
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
    progress.updateStage('PHASE 2', 100);
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
    createdVaccines[type] = 1;

    // Emit finish-player-task if a player created 2 different vaccines.
    if ((createdVaccines['red'] >= 1 && createdVaccines['yellow'] >= 1) &&
        (type === 'red' || type === 'yellow')) {
      console.log('emit: finish-player-task, player1');
      this.gameEvent.emit('finish-player-task', 'player1');
    } else if ((createdVaccines['blue'] >= 1 && createdVaccines['green'] >= 1) &&
              (type === 'blue' || type === 'green')) {
      console.log('emit: finish-player-task, player2');
      this.gameEvent.emit('finish-player-task', 'player2');
    }

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

  function getVaccineList() {
    return createdVaccines;
  }


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
    if (event.keyCode === 48) { // '0'
      console.log('auto solver mode!');
      gameManager1.isAutoSolverMode = true;
      gameManager2.isAutoSolverMode = true;
    }
  });


  // --- Game Title ---
  var playerConfigs = GameTitle.getDefaultPlayerConfigs();
  gameEvent.on('game-title', () => {
    var gameTitle = document.querySelector('.game-title');
    gameTitle.style.opacity = 1;
    gameTitle.style.transition = 'opacity 500ms ease';

    document.addEventListener('keyup', listener);

    function listener(event) {
      // Ready to puzzle
      if (event.keyCode === 68) { // D
        playerConfigs.player1.confirm = true;
        GameTitle.confirmLevel('player1');
      }
      else if (event.keyCode === 39) { // Right arrow
        playerConfigs.player2.confirm = true;
        GameTitle.confirmLevel('player2');
      }
      else if (event.keyCode === 65) { // A
        playerConfigs.player1.confirm = false;
        GameTitle.unconfirmLevel('player1');
        GameTitle.selectLevel('player1', playerConfigs.player1.level);
      }
      else if (event.keyCode === 37) { // Left arrow
        playerConfigs.player2.confirm = false;
        GameTitle.unconfirmLevel('player2');
        GameTitle.selectLevel('player2', playerConfigs.player2.level);
      }
      else if (event.keyCode === 87) { // W
        if (!playerConfigs.player1.confirm && playerConfigs.player1.level < 2) {
          playerConfigs.player1.level += 1;
          GameTitle.selectLevel('player1', playerConfigs.player1.level);
        }
      }
      else if (event.keyCode === 38) { // Up arrow
        if (!playerConfigs.player2.confirm && playerConfigs.player2.level < 2) {
          playerConfigs.player2.level += 1;
          GameTitle.selectLevel('player2', playerConfigs.player2.level);
        }
      }
      else if (event.keyCode === 83) { // S
        if (!playerConfigs.player1.confirm && playerConfigs.player1.level > -2) {
          playerConfigs.player1.level -= 1;
          GameTitle.selectLevel('player1', playerConfigs.player1.level);
        }
      }
      else if (event.keyCode === 40) { // Down arrow
        if (!playerConfigs.player2.confirm && playerConfigs.player2.level > -2) {
          playerConfigs.player2.level -= 1;
          GameTitle.selectLevel('player2', playerConfigs.player2.level);
        }
      }
      else if (event.keyCode === 27) { // ESC
        gameTitle.style.opacity = 0;
        document.removeEventListener('keyup', listener);
      }

      if (playerConfigs.player1.confirm && playerConfigs.player2.confirm) {
        gameManager1.setGameLevel(playerConfigs.player1.level);
        gameManager2.setGameLevel(playerConfigs.player2.level);

        gameTitle.style.opacity = 0;
        gameTitle.addEventListener('transitionend', () => {
          gameEvent.emit('game-intro-transition', playerConfigs);
        }, { once: true });
        document.removeEventListener('keyup', listener);
      }
    }
  });
  gameEvent.on('game-reset', () => {
    playerConfigs = GameTitle.getDefaultPlayerConfigs();
    GameTitle.selectLevel('player1', -1); // easy mode
    GameTitle.selectLevel('player2', -1); // easy mode
  });


  // --- Game Title => Intro animation ---
  var timeoutGameIntroTransition;
  gameEvent.on('game-intro-transition', (playerConfigs) => {
    var gadgets = document.querySelectorAll('.title-animation');
    for (var gadget of gadgets) {
      gadget.classList.remove('on-title');
    }
    timeoutGameIntroTransition = setTimeout(() => {
      // If each player selected Hard mode, skip tutorial.
      if (playerConfigs.player1.level >= 1 && playerConfigs.player2.level >= 1) {
        gameEvent.emit('game-countdown');
      } else {
        console.log('emit: game-intro');
        gameEvent.emit('game-intro');
      }
    }, 1500);
  });
  gameEvent.on('game-reset', () => {
    var gadgets = document.querySelectorAll('.title-animation');
    for (var gadget of gadgets) {
      gadget.classList.add('on-title');
    }
    clearTimeout(timeoutGameIntroTransition);
  });

  // --- Game Introduction ---
  gameEvent.on('game-intro', () => {
    if (window.urlParams.get('skipTutorial')) {
      console.log('skip tutorial');
      gameEvent.emit('game-countdown');
      return;
    }
    intro.start();
    intro.oncomplete(() => {
      gameEvent.emit('game-countdown');
    });
    document.addEventListener('keyup', tutorialSkipListener);
  });
  gameEvent.on('game-reset', () => {
    intro.exit();
    document.removeEventListener('keyup', tutorialSkipListener);
  });
  gameEvent.on('game-tutorial-skip', (playerID) => {
    intro.exit();
    gameEvent.emit('game-countdown');
    document.removeEventListener('keyup', tutorialSkipListener);
  });
  function tutorialSkipListener(event) {
    if (event.keyCode === 32) { // SPACE
      gameEvent.emit('game-tutorial-skip');
    }
  }

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
  gameEvent.on('game-clear', () => { gameEvent.emit('game-result-transition'); });
  gameEvent.on('game-over',  () => { gameEvent.emit('game-result-transition'); });

  // --- Game => Result animation ---
  var timeoutGameResultAnimation1;
  var timeoutGameResultAnimation2;
  gameEvent.on('game-result-transition', () => {
    finalPhase = progress.getCurrentStage() + 2;

    timeoutGameResultAnimation1 = setTimeout(() => {
      var gadgets = document.querySelectorAll('.result-animation');
      for (var gadget of gadgets) {
        gadget.style.transitionDuration = '1000ms';
        gadget.classList.add('on-result');
      }

      console.log('emit: game-result');
      gameEvent.emit('game-result');
    }, 5000);
  });
  gameEvent.on('game-reset', () => {
    clearTimeout(timeoutGameResultAnimation1);
    clearTimeout(timeoutGameResultAnimation2);
    var gadgets = document.querySelectorAll('.result-animation');
    for (var gadget of gadgets) {
      gadget.style.transitionDuration = '500ms';
      gadget.classList.remove('on-result');
    }
  });

  // --- Game Result ---
  var gameResult = new GameResult(gameEvent);
  var finalPhase;
  var timeoutGameResult;
  var resetListener = function (event) {
    // Right arrow or D
    if (event.keyCode === 39 || event.keyCode === 68) {
      console.log('emit: game-reset-transition');
      gameEvent.emit('game-reset-transition');
    }
  }
  gameEvent.on('game-result', () => {
    gameResult.show(createdVaccines, createdKnowledge, finalPhase);

    document.addEventListener('keyup', resetListener);
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
  var timeoutGameResetTransition;
  gameEvent.on('game-reset-transition', () => {
    // Reset game parameters
    timeoutGameResetTransition = setTimeout(() => {
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
  gameEvent.on('game-reset', () => {
    clearTimeout(timeoutGameResetTransition);
  });


  // --- Gamepad ---
  // In game-intro, player1 input (WASD) and player2 input (↑←↓→) will swap
  // because intro.js accepts arrow key event
  var isSwapMapping = false;
  gameEvent.on('game-intro', () => {
    isSwapMapping = true;
  });
  gameEvent.on('game-countdown', () => {
    isSwapMapping = false;
  });
  gameEvent.on('game-reset', () => {
    isSwapMapping = false;
  });

  gameEvent.on('input', (playerID, direction) => {
    var mapping;
    if (isSwapMapping) { // when game intro
      mapping = {
        4: 87, // W
        5: 68, // D
        6: 83, // S
        7: 65, // A
        0: 38, // Up
        1: 39, // Right
        2: 40, // Down
        3: 37, // Left
      };
    } else {
      mapping = {
        0: 87, // W
        1: 68, // D
        2: 83, // S
        3: 65, // A
        4: 38, // Up
        5: 39, // Right
        6: 40, // Down
        7: 37, // Left
      };
    }
    var key = mapping[direction + (playerID - 1) * 4];
    Utils.triggerKeyboardEvent(document, 'keyup', { keyCode: key });
  });
  gameEvent.on('input-special', (key) => {
    Utils.triggerKeyboardEvent(document, 'keyup', { keyCode: key });
  });

  // --- Audio ---
  //var audioPuzzle = new Audio('bgm/puzzle-nc144385.mp3');
  var audioPuzzle = new Audio('bgm/yosinani-bgm.mp3');
  audioPuzzle.volume = 0.6;
  audioPuzzle.addEventListener('ended', () => {
    audioPuzzle.currentTime = 0;
    audioPuzzle.play();
  }, false);
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
  gameEvent.on('game-title', () => {
    audioPuzzle.volume = 0.4;
    audioPuzzle.play();
  });
  gameEvent.on('game-countdown', () => {
    audioFadeout(audioPuzzle);
  })
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
