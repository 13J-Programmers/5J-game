
function gameIntro() {
  var intro = introJs();
  intro.setOptions({
    steps: [
      {
        element: document.querySelector('.virus-list'),
        intro: "This is a virus."
      },
    ]
  });

  return intro;
}
