
class GameResult {
  constructor() {
    this.gameResultWrapper = document.querySelector('.game-result-wrapper');
    this.gameResultWrapper.style.transition = 'opacity 500ms ease';

    this.phaseDesc = {
      2: "動物から人へ感染する前にワクチンが完成した",
      3: "人から人へ感染する前にワクチンが完成した",
      4: "人から人への感染を小さい集団で抑え込むことができた",
      5: "集団感染が確認されたが、アウトブレイクは食い止めた",
      6: "アウトブレイクが発生したが、 パンデミックは食い止めた",
      7: "パンデミックが発生し、壊滅的な被害が確認されている",
    };

    gameEvent.on('game-reset', () => {
      this.hide();
    });
  }

  show(createdVaccines, createdKnowledge, phase) {
    // be visible
    this.gameResultWrapper.style.opacity = 1;

    // win/lose
    var isCreatedAllVaccines = Utils.values(createdVaccines).every(x => x > 0);
    var gameResultTitle = this.gameResultWrapper.querySelector('.game-result-title');
    if (isCreatedAllVaccines) {
      gameResultTitle.textContent = "人類勝利";
    } else {
      gameResultTitle.textContent = "人類滅亡";
    }


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

    // phase
    var phaseDOM = document.querySelector('.phase');
    phaseDOM.textContent = (phase === 7) ? 'PANDEMIC' : 'PHASE ' + phase;
    var phaseDescDOM = document.querySelector('.phase-desc');
    phaseDescDOM.textContent = this.phaseDesc[phase];
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

    // phase
    var phaseDOM = document.querySelector('.phase');
    phaseDOM.textContent = '';
    var phaseDescDOM = document.querySelector('.phase-desc');
    phaseDescDOM.textContent = '';
  }
}
