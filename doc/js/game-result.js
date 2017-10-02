
class GameResult {
  constructor() {
    this.gameResultWrapper = document.querySelector('.game-result-wrapper');
    this.gameResultWrapper.style.transition = 'opacity 500ms ease';

    gameEvent.on('game-reset', () => {
      this.hide();
    });
  }

  show(createdVaccines, createdKnowledge, elapsedTime) {
    // be visible
    this.gameResultWrapper.style.opacity = 1;

    // vaccines
    for (var type in createdVaccines) {
      var syringe = this.gameResultWrapper.querySelector('.syringe-' + type);
      if (createdVaccines[type] > 0) {
        syringe.style.opacity = 1;
      } else {
        syringe.style.opacity = 0.1;
      }
    }

    // knowledge
    var packCount = Utils.values(createdKnowledge).reduce((a, b) => a + b);
    var packCountDOM = this.gameResultWrapper.querySelector('.pack-count');
    packCountDOM.textContent = packCount;

    // time
    var elapsedTimeDOM = document.querySelector('.elapsed-time');
    elapsedTimeDOM.textContent = Utils.dateToMMSS(elapsedTime);
  }

  hide() {
    // be unvisible
    this.gameResultWrapper.style.opacity = 0;

    // vaccines
    var types = ['red', 'yellow', 'green', 'blue'];
    for (var type of types) {
      var syringe = this.gameResultWrapper.querySelector('.syringe-' + type);
      syringe.style.opacity = 0.1;
    }

    // knowledge
    var packCountDOM = this.gameResultWrapper.querySelector('.pack-count');
    packCountDOM.textContent = 0;

    // time
    var elapsedTimeDOM = document.querySelector('.elapsed-time');
    elapsedTimeDOM.textContent = '';
  }
}
