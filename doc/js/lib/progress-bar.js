
class ProgressBar {
  constructor(stages, currentStage, container) {
    ProgressBar.singleStepAnimation = 1000; // default value
    // this delay is required as browser will need some time in rendering
    // and then processing css animations.
    this.renderingWaitDelay = 0; // 200

    this.container = container;
    this.stages = stages;

    if (this.validateParameters(stages, currentStage, container)) {
      var wrapper = document.getElementsByClassName(container);
      if (wrapper.length > 0) {
        wrapper = wrapper[0];
      } else {
        wrapper = this.createElement('div', 'progressbar-wrapper', {}, '');
        document.body.appendChild(wrapper);
      }
      this.createHTML(wrapper, stages, currentStage);
    }
  }

  // A utility function to create an element
  createElement(type, className, style, text) {
    var elem = document.createElement(type);
    elem.className = className;
    for (var prop in style) {
      elem.style[prop] = style[prop];
    }
    elem.innerHTML = text;
    return elem;
  };

  createStatusBar(stages, stageWidth, currentStageIndex) {
    var statusBar = this.createElement('div', 'status-bar', {width: 100 - stageWidth + '%'}, '');
    var currentStatus = this.createElement('div', 'current-status', {}, '');
    this.currentStatus = currentStatus;

    setTimeout(function() {
      currentStatus.style.width = (100 * currentStageIndex) / (stages.length - 1) + '%';
      currentStatus.style.transition = 'width ' + (currentStageIndex * ProgressBar.singleStepAnimation) + 'ms linear';
    }, this.renderingWaitDelay);

    statusBar.appendChild(currentStatus);
    return statusBar;
  }

  createCheckPoints(stages, stageWidth, currentStageIndex) {
    var ul = this.createElement('ul', 'progress-bar', {}, '');
    var animationDelay = this.renderingWaitDelay;
    for (var index = 0; index < stages.length; index++) {
      var li = this.createElement('li', 'section', {width: stageWidth + '%'}, stages[index]);
      if (currentStageIndex >= index) {
        setTimeout(function(li, currentStageIndex, index) {
          li.className += (currentStageIndex > index) ? ' visited' : ' visited current';
        }, animationDelay, li, currentStageIndex, index);
        animationDelay += ProgressBar.singleStepAnimation;
      }
      ul.appendChild(li);
    }
    return ul;
  }

  createHTML(wrapper, stages, currentStage) {
    var stageWidth = 100 / stages.length;
    var currentStageIndex = stages.indexOf(currentStage);
    this.currentStageIndex = currentStageIndex;

    // create status bar
    var statusBar = this.createStatusBar(stages, stageWidth, currentStageIndex);
    wrapper.appendChild(statusBar);

    // create checkpoints
    var checkpoints = this.createCheckPoints(stages, stageWidth, currentStageIndex);
    wrapper.appendChild(checkpoints);

    return wrapper;
  }

  validateParameters(stages, currentStage, container) {
    if (!(typeof stages === 'object' && stages.length && typeof stages[0] === 'string')) {
      console.error('Expecting Array of strings for "stages" parameter.');
      return false;
    }
    if (typeof currentStage !== 'string') {
      console.error('Expecting string for "current stage" parameter.');
      return false;
    }
    if (typeof container !== 'string' && typeof container !== 'undefined') {
      console.error('Expecting string for "container" parameter.');
      return false;
    }
    return true;
  }

  updateStatusBar(nextStage, duration) {
    duration = duration || ProgressBar.singleStepAnimation;
    var stages = this.stages;
    var stageWidth = 100 / stages.length;
    var nextStageIndex = stages.indexOf(nextStage);
    var diff = Math.round(Math.abs(this.currentStageIndex - nextStageIndex));
    setTimeout(() => {
      this.currentStatus.style.width = (100 * nextStageIndex) / (stages.length - 1) + '%';
      this.currentStatus.style.transition = 'width ' + (diff * duration) + 'ms linear';
    }, this.renderingWaitDelay);
  }

  updateCheckPoints(nextStage, duration) {
    duration = duration || ProgressBar.singleStepAnimation;
    var stages = this.stages;
    var currentStageIndex = this.currentStageIndex;
    var nextStageIndex = stages.indexOf(nextStage);
    var animationDelay = this.renderingWaitDelay;
    var checkpoints = document.querySelectorAll('.' + this.container + ' li');

    if (currentStageIndex === nextStageIndex) return;

    if (nextStageIndex > currentStageIndex) {
      checkpoints[currentStageIndex].classList.remove('current');
      for (var i = currentStageIndex; i <= nextStageIndex; i++) {
        setTimeout((checkpoints, i) => {
          checkpoints[i].classList.add('visited');
          if (i === nextStageIndex) {
            checkpoints[nextStageIndex].classList.add('current');
          }
        }, animationDelay, checkpoints, i);
        animationDelay += duration;
      }
    }

    if (nextStageIndex < currentStageIndex) {
      var i;
      checkpoints[currentStageIndex].classList.remove('current');
      for (i = currentStageIndex; i >= nextStageIndex; i--) {
        setTimeout((checkpoints, i) => {
          if (i !== nextStageIndex) {
            checkpoints[i].classList.remove('visited');
          } else {
            checkpoints[i].classList.add('visited');
            checkpoints[nextStageIndex].classList.add('current');
          }
        }, animationDelay, checkpoints, i);
        animationDelay += duration;
      }
    }

    this.currentStageIndex = nextStageIndex;
  }

  updateStage(nextStage, duration) {
    this.updateStatusBar(nextStage, duration);
    this.updateCheckPoints(nextStage, duration);
    return true;
  }

  incrementStage(duration) {
    if (this.currentStageIndex + 1 >= this.stages.length) return false;
    var nextStage = this.stages[this.currentStageIndex + 1];
    return this.updateStage(nextStage, duration);
  }

  decrementStage(duration) {
    if (this.currentStageIndex - 1 < 0) return false;
    var nextStage = this.stages[this.currentStageIndex - 1];
    return this.updateStage(nextStage, duration);
  }
}
