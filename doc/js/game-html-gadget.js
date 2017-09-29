
class HTMLGadget {
  constructor(gameEvent) {

    // --- Virus and Vaccine ---
    this.createdVaccines = {
      red:    false,
      blue:   false,
      yellow: false,
      green:  false,
    };
    gameEvent.on('create-vaccine', (type) => {
      var types = ['red', 'yellow', 'green', 'blue'];
      for (var i = 0; i < types.length; i++) {
        var type_i = types[i];
        if (type_i == type) {
          this.createdVaccines[type] = true;
          var virus = document.querySelector('.game-virus-panel.virus-' + type);
          virus.style.opacity = 0.5;
        }
      }

      var isCreatedAllVaccines = Utils.hash2array(this.createdVaccines).every(x => x);
      if (isCreatedAllVaccines) {
        console.log("game clear!!");
        gameManager1.actuator.message({ won: true });
        gameManager2.actuator.message({ won: true });
      }
    });

    // --- Knowledge ---
    gameEvent.on('create-knowledge', function (type) {
      // TODO: Additional Time
    })
  }
}
