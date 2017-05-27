
window.requestAnimationFrame(() => {
  var main_event = new EventEmitter();
  var socket = io();
  var player_count = $('#player-count');
  var modal_overlay = $('.modal-overlay');
  var modal_game_waiting = $('.modal-game-waiting');
  var game_start_info  = $('.game-start-info');
  var game_start_info2 = $('.game-start-info2');
  var start_countdown = 3;

  socket.emit('game-enter', 'A new player is entered');

  socket.on('game-room-player-count', function (received_data) {
    player_count.text(received_data.count);
  })

  socket.on('game-start', function (received_data) {
    var color_map = { red: "赤", blue: "青", yellow: "黄", green: "緑" };
    var message  = "あなたは" + color_map[received_data.color] + "色のワクチンを作ってください。<br>";
    var message2 = "開始まで... ";

    // Show player's color assigned by server.
    console.log("Assigned color: " + received_data.color);
    game_start_info.html(message);
    setTimeout(function f(n) {
      if (n <= 0) {
        main_event.emit('puzzle-start', true);
        return;
      }
      game_start_info2.html(message2 + n);
      setTimeout(f, 1000, n-1);
    }, 1000, start_countdown);

    main_event.on('puzzle-start', function () {
      modal_overlay.fadeOut();
      modal_game_waiting.fadeOut();
      new GameManager(received_data.color, InputManager, HTMLActuator, socket);
    });

  })
});
