var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var players = require('./routes/players');

var app = express();
// call socket.io to the app
app.io = require('socket.io')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/players', players);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// --- game ---

class Utils {
  /**
   * Shuffles array in place.
   * @param {Array} a items - The array containing the items.
   */
  static shuffle(array) {
    var a = array.slice(0); // deep copy
    var i, j, x;
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
    return a;
  }
}

var Game = {
  colors: ["red", "blue", "green", "yellow"]
};

// --- websocket ---

// start listen with socket.io
app.io.on('connection', function (socket) {
  console.log('a player connected');

  socket.on('game-enter', function (received_data) {
    socket.join('game-room');
    app.io.in('game-room').clients(function (err, clients) {
      if (err) throw err;
      console.log(clients);

      // Send a player count
      clients.forEach((socketid, idx) => {
        app.io.to(socketid).emit('game-room-player-count', { count: clients.length });
      });

      if (clients.length == 4) {
        // Send a game start
        var shuffledColors = Utils.shuffle(Game.colors);
        clients.forEach((socketid, idx) => {
          app.io.to(socketid).emit('game-start', { color: shuffledColors[idx] });
        });
      }
    });
  });

  socket.on('game-new-event', function (msg) {
    app.io.to('game-room').emit('game-event', msg);
  });
});

module.exports = app;
