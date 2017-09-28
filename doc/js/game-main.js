
window.urlParams = new URLParams(location);

window.requestAnimationFrame(() => {
  var color = "red";
  var _gameManager = new GameManager(
    color, InputManager, HTMLActuator, HTMLGadget);
  if (window.location.hostname === "localhost") { // debug mode
    window.gameManager = _gameManager;
  }

  var earthGlobe = new EarthGlobe(".game-background");
  earthGlobe.loop();
});

// window.requestAnimationFrame(() => {
//   var mainEvent = new EventEmitter();
//   var socket = io();
//   var playerCount = $('#player-count');
//   var modalOverlay = $('.modal-overlay');
//   var modalGameWaiting = $('.modal-game-waiting');
//   var gameStartInfo  = $('.game-start-info');
//   var gameStartInfo2 = $('.game-start-info2');
//   var gameStartInfo3 = $('.game-start-info3');
//   var startCountdown = window.urlParams.get('startCountdown') || 3;
//   var loader = $('.loader');
//
//   socket.emit('game-enter', 'A new player is entered');
//
//   socket.on('game-room-player-count', function (receivedData) {
//     playerCount.text(receivedData.count);
//   })
//
//   socket.on('game-start', function (receivedData) {
//     console.log("Assigned color: " + receivedData.color);
//
//     var color    = receivedData.color;
//     var cssColor = GameManager.cssColorMap[color];
//     var colorMap = { red: "赤", blue: "青", yellow: "黄", green: "緑" };
//     var message  =
//       'あなたは' + colorMap[color] + '色のワクチンを作ってください。';
//     var message2 = $("<div></div>")
//       .css({
//         width: '107px',
//         height: '107px',
//         'border-radius': '5px',
//         background: cssColor + ' url("/images/tile-syringe.png")',
//         'background-size': 'contain'
//       })
//     var message3 = "開始まで... ";
//
//     // Show player's color assigned by server.
//     loader.hide();
//     gameStartInfo.html(message);
//     gameStartInfo2.html(message2);
//     setTimeout(function f(n) {
//       if (n <= 0) {
//         mainEvent.emit('puzzle-start', true);
//         return;
//       }
//       gameStartInfo3.html(message3 + n);
//       setTimeout(f, 1000, n-1);
//     }, 1000, startCountdown);
//
//     mainEvent.on('puzzle-start', function () {
//       modalOverlay.fadeOut();
//       modalGameWaiting.fadeOut();
//       var _gameManager = new GameManager(receivedData.color,
//         InputManager, HTMLActuator, HTMLGadget, socket);
//       if (window.location.hostname === "localhost") { // debug mode
//         window.gameManager = _gameManager;
//       }
//     });
//   });
//
//   socket.on('quit', function (receivedData) {
//     location.reload();
//   });
// });
