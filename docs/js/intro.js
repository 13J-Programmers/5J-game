
function gameIntro() {
  let intro = introJs();

  intro.setOptions({
    showStepNumbers: false,
    showBullets: false,
    nextLabel: ' Ⓐ > ',
    prevLabel: ' < Ⓨ ',
    skipLabel: ' ',
    doneLabel: ' Ⓐ ',
    steps: [
      {
        intro: '20XX年, 地球上で未知のウイルスが発見された. ' +
          '<br><br><br><small>PLAYER1 の Ⓐ ボタンで進む</small>',
        tooltipClass: 'tooltiptext-margin-top-120',
      },
      {
        intro: 'そのウイルスは猛威を奮い, 人類滅亡はすぐそこまで迫っている. ',
        tooltipClass: 'tooltiptext-margin-top-120',
      },
      {
        intro: '一刻も早くワクチンを作るため, 二人の科学者が立ち上がった. ',
        tooltipClass: 'tooltiptext-margin-top-120',
      },
      {
        element: document.querySelector('.virus-list'),
        intro: 'これがウイルスだ. 君たちには協力して2つずつワクチンを作ってもらう.',
        tooltipClass: 'width-15em height-7em tooltiptext-margin-top-20',
      },
      {
        element: document.querySelector('.virus-list .player1'),
        intro: 'PLAYER1 は「<span class="red">赤色</span>」と' +
          '「<span class="yellow">黄色</span>」のワクチンを作る. ',
        tooltipClass: 'width-15em tooltiptext-margin-top-120',
      },
      {
        element: document.querySelector('.virus-list .player2'),
        intro: 'PLAYER2 は「<span class="green">緑色</span>」と' +
          '「<span class="blue">青色</span>」のワクチンを作る. ',
        tooltipClass: 'width-15em tooltiptext-margin-top-120',
      },
      {
        element: document.querySelector('.puzzle-list .player2'),
        intro: 'これはパズルの盤面だ. 同じ色の「抗体」を合体させてワクチンを作る. ',
        tooltipClass: 'width-20em height-7em tooltiptext-margin-top-60',
      },
      {
        element: document.querySelector('.progress-bar-wrapper'),
        intro: 'これは残り時間だ. 一番右まで到達してしまうと時間切れとなる. ',
        tooltipClass: 'width-15em height-5em tooltiptext-margin-top-20',
      },
      {
        intro: '同じ色の抗体を合体させると, より強力な抗体ができあがる.<br>' +
          '<img src="img/tutorial-tile-merge.png">',
        tooltipClass: 'tooltiptext-margin-top-20',
      },
      {
        intro: '4つのボタンで上下左右に動かしながら, 同じ色を合わせていく.<br><br>' +
          '<video width="400" height="400" autoplay loop>' +
          '<source src="video/tutorial.mp4">' +
          '</video>',
        tooltipClass: 'height-17em tooltiptext-margin-top-20',
      },
      {
        intro: '自分の色の抗体を30個合体させると, ワクチンが完成する.<br>' +
          '<img src="img/tutorial-tile-syringe.png">' +
          '<br><small>（Easy モードでは 20 個, Very Easy モードでは 10 個）</small>',
        tooltipClass: 'height-12em tooltiptext-margin-top-20',
      },
      {
        intro: '自分の色以外の抗体を20個合体させると, ビンが完成する.<br>' +
          'ビンを作ることによって現れる抗体の数が増える.<br>' +
          '<img src="img/tutorial-tile-pack.png">' +
          '<br><small>（Easy モードでは 10 個, Very Easy モードでは 6 個）</small>',
        tooltipClass: 'height-12em tooltiptext-margin-top-20',
      },
      {
        intro: '最終目標は2人で協力して4つ全てのワクチンを作ることだ. <br><br>' +
          '<img src="img/tutorial-syringes.png">',
        tooltipClass: 'tooltiptext-margin-top-60',
      },
      {
        intro: '操作方法はご理解いただけただろうか.',
        tooltipClass: 'tooltiptext-margin-top-120',
      },
      {
        intro: 'それでは, 健闘を祈る.',
        tooltipClass: 'tooltiptext-margin-top-120',
      },
    ]
  });

  return intro;
}
