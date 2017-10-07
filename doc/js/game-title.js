
class GameTitle {
  static getDefaultPlayerConfigs() {
    var config = {
      player1: {
        confirm: false,
        level: 0,
      },
      player2: {
        confirm: false,
        level: 0,
      },
    };
    return JSON.parse(JSON.stringify(config));
  }

  static selectLevel(player, level) {
    var playerLevel = document.querySelectorAll('.game-title .level-select .' + player + ' .level');
    for (var i = 0; i < playerLevel.length; i++) {
      if (i === level) {
        playerLevel[i].classList.add('current');
      } else {
        playerLevel[i].classList.remove('current');
      }
      playerLevel[i].classList.remove('confirm');
    }
    var upArrow   = document.querySelector('.game-title .level-select .' + player + ' .level-up');
    var downArrow = document.querySelector('.game-title .level-select .' + player + ' .level-down');
    upArrow.style.opacity   = (level === 2) ? 0 : 1;
    downArrow.style.opacity = (level === 0) ? 0 : 1;
  }

  static confirmLevel(player) {
    var currentLevel = document.querySelector('.game-title .level-select .' + player + ' .current');
    currentLevel.classList.add('confirm');
    var upArrow   = document.querySelector('.game-title .level-select .' + player + ' .level-up');
    var downArrow = document.querySelector('.game-title .level-select .' + player + ' .level-down');
    upArrow.style.opacity   = 0;
    downArrow.style.opacity = 0;
  }
}
