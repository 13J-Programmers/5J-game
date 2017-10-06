
function gameIntro() {
  let intro = introJs();

  intro.setOptions({
    showStepNumbers: false,
    showBullets: false,
    nextLabel: ' Ⓐ ',
    prevLabel: ' Ⓑ ',
    skipLabel: ' Skip(START) ',
    doneLabel: ' Ⓐ ',
    steps: [
      {
        intro: "20XX年, 地球上で未知のウイルスが発見された. "
      },
      {
        intro: "そのウイルスは猛威を奮い, 人類滅亡はすぐそこまで迫っている. "
      },
      {
        intro: "一刻も早くワクチンを作るため, 二人の科学者が立ち上がった. "
      }
    ]
  });

  return intro;
}

function gameIntroMiddle() {
  var chardin = {
    start: () => {
      // Set description for chardin.js
      var virusDesc = document.querySelector('.virus-list .virus-blue');
      virusDesc.setAttribute('data-intro',
        'これがウイルスだ. 君たちには協力して2つずつワクチンを作ってもらう. ');
      virusDesc.setAttribute('data-position', 'left');
      var puzzleDesc = document.querySelector('.game-container.player1');
      puzzleDesc.setAttribute('data-intro',
        'このパズルを使ってワクチンを作る. 操作方法は簡単だ. ' +
        '4つのボタンでこのパズルを上下左右に動かすことによって, 同じ色の薬を合体させるだけだ.');
      puzzleDesc.setAttribute('data-position', 'right');
      var progressbarSections = document.querySelectorAll('.progress-bar .section');
      var progressDesc = progressbarSections[progressbarSections.length - 1];
      progressDesc.setAttribute('data-intro',
        'これは残り時間だ. 一番右まで到達してしまうと時間切れとなる. ');
      progressDesc.setAttribute('data-position', 'left');

      // Start chardin
      $('body').chardinJs('start');
    },
    stop: () => {
      $('body').chardinJs('stop');
    }
  }

  return chardin;
}

function gameIntroLast() {
  let intro = introJs();

  intro.setOptions({
    showStepNumbers: false,
    showBullets: false,
    nextLabel: ' Ⓐ ',
    prevLabel: ' Ⓑ ',
    skipLabel: ' Skip(START) ',
    doneLabel: ' Ⓐ ',
    steps: [
      {
        intro: "操作方法はご理解いただけただろうか. "
      },
      {
        intro: "それでは, 健闘を祈る. "
      }
    ]
  });

  return intro;
}
