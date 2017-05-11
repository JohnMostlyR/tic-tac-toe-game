(function (window) {
  'use strict';

  const document = window.document;

  function View(model) {
    this.model = model;
    this.form = document.getElementById('js-ttt-preferences-form');

    // holds the state of the initial controls visibility
    this.intialControlsVisible = true;

    // holds the current visible view
    this.currentView = '';

    this.currentElementNode = null;

    this.showSetupStage();
  }

  View.prototype.showSetupStage = function () {
    this.gameSetupStage = true;
    this.form.style.opacity = 1;
    this.form.style.removeProperty('width');

    const scrollNode = document.querySelector('.l-scroll');
    scrollNode.style.marginTop = '-10vmin';

    ['l-rhombus-banner', 'l-whose-turn', 'l-board'].forEach((cssClass) => {
      const nodeList = document.querySelectorAll(`.${cssClass}`);
      [...nodeList].forEach((node) => {
        // node.classList.add('s-hidden');
        node.style.opacity = 0;

        if (cssClass === 'l-board') {
          node.style.width = 0;
        }
      });
    });
  };

  View.prototype.showGameStage = function () {
    this.gameSetupStage = false;
    this.form.style.opacity = 0;
    this.form.style.width = 0;

    const gameType = this.model.getProperty('gameType');

    if (gameType === 2) {
      document.getElementById('js-ttt-show-score-computer').style.display = 'none';
    } else {
      document.getElementById('js-ttt-show-score-human').style.display = 'none';
    }

    const scrollNode = document.querySelector('.l-scroll');
    scrollNode.style.removeProperty('margin-top');

    ['l-rhombus-banner', 'l-board'].forEach((cssClass) => {
      const nodeList = document.querySelectorAll(`.${cssClass}`);
      [...nodeList].forEach((node) => {
        node.style.removeProperty('opacity');

        if (cssClass === 'l-board') {
          node.style.removeProperty('width');
        }
      });
    });
  };

  View.prototype.showResult = function (result, positions) {
    positions.forEach((position) => {
      const buttonNode = document.getElementById(position);
      buttonNode.style.color = '#e11f27';
    });

    const resultNode = document.getElementById('js-ttt-result');
    resultNode.innerHTML = result;

    const resultBanner = document.getElementById('js-ttt-end-result');
    resultBanner.style.display = 'inherit';

    document.getElementById('js-ttt-show-player-one-score').innerHTML = this.model.getProperty('playerOneScore');
    document.getElementById('js-ttt-show-player-two-score').innerHTML = this.model.getProperty('playerTwoScore');
  };

  View.prototype.switchViewTo = function (turn) {

    // helper function for async calling
    const _switch = (_turn) => {
      console.info(`#${_turn}`);
      this.currentView = document.querySelector(`#${_turn}`);
      this.currentView.style.display = 'block';
    };

    if (this.intialControlsVisible) {
      // if the game is just starting
      this.intialControlsVisible = false;
      document.querySelector('.initial').style.display = 'none';
      _switch(turn);
    } else {
      // if the game is in an intermediate state
      this.currentView.style.display = 'none';
      _switch(turn);
    }
  };

  View.prototype.updateView = function (elementId) {
    const _updateElement = (_elementId) => {
      this.currentElementNode = document.querySelector(`#js-ttt-${_elementId}`);
      this.currentElementNode.style.opacity = 1;
    };

    if (this.currentElementNode) {
      this.currentElementNode.style.opacity = 0;
    }

    _updateElement(elementId);
  };

  View.prototype.enableStartButton = function () {
    const submitBtn = this.form.querySelector('input[type="submit"');
    submitBtn.removeAttribute('disabled');
    submitBtn.classList.remove('s-hidden');
  };

  View.prototype.claimCell = function (idx, avatar) {
    const targetCell = document.getElementById(`js-ttt-btn-${idx}`);
    targetCell.innerHTML = avatar;
    targetCell.setAttribute('disabled', 'disabled');
  };

  View.prototype.subscribe = function (event, subscriber) {
    switch (event) {
      case 'onEnterPreference':
        this.form.addEventListener('change', (ev) => {
          if (ev.target && ev.target.name) {
            const name = ev.target.name.toUpperCase();
            const value = ev.target.value.toUpperCase();

            subscriber(name, value);
          }
        }, true);
        break;
      case 'onClickStart':
        this.form.addEventListener('submit', (ev) => {
          ev.stopPropagation();
          ev.preventDefault();

          this.form.classList.add('s-disabled');
          subscriber();
        });
        break;
      case 'onClickCell':
        window.addEventListener('click', (ev) => {
          if (ev.target && ev.target.id) {
            if (ev.target.id.toLowerCase().substr(0, 11) === 'js-ttt-btn-') {
              ev.stopPropagation();
              subscriber(parseInt(ev.target.id.substr(11)));
            }
          }
        });
        break;
      default:
        console.error(`No such event: ${event}`);
        break;
    }
  };

  window.ttt = window.ttt || {};
  window.ttt.View = View;
})(window);
