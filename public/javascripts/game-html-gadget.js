
class HTMLGadget {
  constructor(myType) {
    this.types = ["red", "blue", "yellow", "green"];
    this._isValidType(myType);
    this.myType = myType;
    this.myGamePanel = document.getElementById('myGamePanel');
    this.gamePanels = {
      red:    document.getElementById('redGamePanel'),
      blue:   document.getElementById('blueGamePanel'),
      yellow: document.getElementById('yellowGamePanel'),
      green:  document.getElementById('greenGamePanel'),
    };
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

    this.init();
  }

  init() {
    // console.log("init!");
    var originalGamePanel = this.gamePanels[this.myType];
    var myGamePanel = originalGamePanel.cloneNode(true);
    originalGamePanel.classList.add("hidden");
    this.myGamePanel.replaceChild(myGamePanel, this.myGamePanel.firstChild);
  }

  incrementPackNum(type) {
    if (!this._isValidType(type)) return;
    this.packNums[type]++;
    this.packNumElements[type].innerText = this.packNums[type];
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
