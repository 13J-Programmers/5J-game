
class HTMLGadget {
  constructor(myType) {
    this.types = ["red", "blue", "yellow", "green"];
    this._isValidType(myType);
    this.myType = myType;
    // game panels
    this.myGamePanel = document.getElementById('myGamePanel');
    this.gamePanels = {
      red:    document.getElementById('redGamePanel'),
      blue:   document.getElementById('blueGamePanel'),
      yellow: document.getElementById('yellowGamePanel'),
      green:  document.getElementById('greenGamePanel'),
    };
    // pack
    this.packNums = {
      red:    0,
      blue:   0,
      yellow: 0,
      green:  0,
    };
    this.packNumElements = {
      red:    document.getElementById('redPackNum'),
      blue:   document.getElementById('bluePackNum'),
      yellow: document.getElementById('yellowPackNum'),
      green:  document.getElementById('greenPackNum'),
    };
    // syringe
    this.syringeElements = {
      red:    document.getElementById('redSyringe'),
      blue:   document.getElementById('blueSyringe'),
      yellow: document.getElementById('yellowSyringe'),
      green:  document.getElementById('greenSyringe'),
    }
    // outbreak
    this.outbreakStep = 0;
    this.outbreakMarker = document.getElementById('outbreakMarker');
    // infection rate
    this.infectionRate = 0;
    this.infectionRateMarker = document.getElementById('infectionRateMarker');

    this.init();
  }

  init() {
    var target = this.gamePanels[this.myType];
    this.myGamePanel.appendChild(target);
  }

  incrementPackNum(type) {
    if (!this._isValidType(type)) return;
    this.packNums[type]++;
    this.packNumElements[type].innerText = this.packNums[type];
  }

  addSyringe(type) {
    if (!this._isValidType(type)) return;
    this.syringeElements[type].classList.remove('hidden');
  }

  incrementOutbreak() {
    if (this.outbreakStep >= 8) return;
    this.outbreakMarker.classList.remove('outbreak-marker-step' + this.outbreakStep);
    this.outbreakStep++;
    this.outbreakMarker.classList.add('outbreak-marker-step' + this.outbreakStep);
  }

  incrementInfectionRate() {
    if (this.infectionRate >= 6) return;
    this.infectionRateMarker.classList.remove('infection-rate-marker-step' + this.infectionRate);
    this.infectionRate++;
    this.infectionRateMarker.classList.add('infection-rate-marker-step' + this.infectionRate);
  }

  _isValidType(type) {
    if (this.types.indexOf(type) == -1) {
      console.error("unknown type: " + type);
      return false;
    } else {
      return true;
    }
  }
}
