
function startIntro() {
  var intro = introJs();
  intro.setOptions({
    steps: [
      {
        element: document.querySelector('.virus-list'),
        intro: "This is a virus."
      },
    ]
  });

  intro.start();
}
