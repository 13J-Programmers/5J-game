
window.urlParams = new URLParams(location);

class GameEvent extends EventEmitter {}
var gameEvent = new GameEvent();

window.addEventListener('load', () => {
  // --- Init Puzzle ---
  var gameManager1 = new GameManager(1, InputManager, HTMLActuator, gameEvent);
  var gameManager2 = new GameManager(2, InputManager, HTMLActuator, gameEvent);
  if (window.location.hostname === 'localhost') {
    // debug mode
    window.gameManager1 = gameManager1;
    window.gameManager2 = gameManager2;
  }

  // gadget
  var htmlGadget = new HTMLGadget(gameEvent);

  // earth globe
  var earthGlobe = new EarthGlobe("#game-background");
  earthGlobe.loop();
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

  // progress bar
  var stages = ['PHASE 1', 'PHASE 2', 'PHASE 3', 'PHASE 4', 'PHASE 5', 'PHASE 6'];
  var progress = new ProgressBar(stages, 'PHASE 1', 'progress-bar-wrapper');
  var timeout;
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
  }, 20000, progress);

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

});
