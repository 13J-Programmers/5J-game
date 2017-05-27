
window.requestAnimationFrame(() => {
  var socket = io();
  var player_count = $('#player-count');
  var modal_overlay = $('.modal-overlay');
  var modal_game_waiting = $('.modal-game-waiting');

  socket.emit('game-enter', 'A new player is entered');

  socket.on('game-room-player-count', function (received_data) {
    player_count.text(received_data.count);
  })

  socket.on('game-start', function (received_data) {
    modal_overlay.hide();
    modal_game_waiting.hide();

    console.log("Assigned color: " + received_data.color);
    // Show player's color assigned by server.
    // TODO: 3sec

    new GameManager(received_data.color, InputManager, HTMLActuator, socket);
  })
});
