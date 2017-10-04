
function gameIntro() {
  let intro = introJs();

  intro.setOptions({
    showStepNumbers: false,
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

function gameIntroLast() {
  let intro = introJs();

  intro.setOptions({
    showStepNumbers: false,
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
