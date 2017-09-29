
window.urlParams = new URLParams(location);

class GameEvent extends EventEmitter {}
var gameEvent = new GameEvent();

window.requestAnimationFrame(() => {
  // --- Init Puzzle ---
  var gameManager1 = new GameManager(1, InputManager, HTMLActuator);
  var gameManager2 = new GameManager(2, InputManager, HTMLActuator);
  if (window.location.hostname === "localhost") {
    // debug mode
    window.gameManager1 = gameManager1;
    window.gameManager2 = gameManager2;
  }

  // gadget
  var htmlGadget = new HTMLGadget(gameEvent);
});
