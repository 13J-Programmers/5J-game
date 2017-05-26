
window.requestAnimationFrame(() => {
  var socket = io();
  new GameManager("red", InputManager, HTMLActuator, socket);
});
