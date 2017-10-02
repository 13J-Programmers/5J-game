
function gameIntro() {
  var intro = introJs();
  intro.setOptions({
    steps: [
      {
        element: document.querySelector('.virus-list'),
        intro: "人類を脅かす4種類のウイルス"
      },
    ]
  });

  return intro;
}
