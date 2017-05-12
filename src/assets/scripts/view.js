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

    // Show the form for adding preferences.
    this.form.reset();
    this.form.style.opacity = 1;
    this.form.style.removeProperty('width');

    // Move the scroll up a bit as there would be a huge space where the scores and the indicator of whose turn it is
    // would otherwise be.
    const scrollNode = document.querySelector('.l-scroll');
    scrollNode.style.marginTop = '-10vmin';

    // Hide the score board, the indicator of whose turn it is and the game board.
    ['l-rhombus-banner', 'l-whose-turn', 'l-board', 'l-reset-button'].forEach((cssClass) => {
      const nodeList = document.querySelectorAll(`.${cssClass}`);
      [...nodeList].forEach((node) => {
        node.style.opacity = 0;

        // The game board needs to make room for the preference form.
        if (cssClass === 'l-board') {
          node.style.width = 0;
        }
      });
    });
  };

  View.prototype.showGameStage = function () {
    this.gameSetupStage = false;

    // Show the form for adding preferences.
    this.form.style.opacity = 0;

    // Make room for the game board.
    this.form.style.width = 0;

    // Show scores for human player two or computer depending on the game type, which can be one player or two players.
    const gameType = this.model.getProperty('gameType');

    if (gameType === 2) {

      // Two players game.
      document.getElementById('js-ttt-show-score-computer').style.display = 'none';
    } else {

      // One against computer
      document.getElementById('js-ttt-show-score-human').style.display = 'none';
    }

    // Move the scroll down to its normal position.
    const scrollNode = document.querySelector('.l-scroll');
    scrollNode.style.removeProperty('margin-top');

    // Show the score board and the game board.
    ['l-rhombus-banner', 'l-board', 'l-reset-button'].forEach((cssClass) => {
      const nodeList = document.querySelectorAll(`.${cssClass}`);
      [...nodeList].forEach((node) => {
        node.style.removeProperty('opacity');

        // Set the game board back to its original size.
        if (cssClass === 'l-board') {
          node.style.removeProperty('width');
        }
      });
    });
  };

  View.prototype.showResult = function (result, positions) {

    // highlight the winning positions
    if (positions && Array.isArray(positions)) {
      positions.forEach((position) => {
        const buttonNode = document.getElementById(position);
        buttonNode.style.color = '#e11f27';
      });
    }

    // add result text
    const resultNode = document.getElementById('js-ttt-result');
    resultNode.innerHTML = result;

    // show the result
    const resultBanner = document.getElementById('js-ttt-end-result');
    resultBanner.style.display = 'inherit';

    // update the score boards
    document.getElementById('js-ttt-show-player-one-score').innerHTML = this.model.getProperty('playerOneScore');
    document.getElementById('js-ttt-show-player-two-score').innerHTML = this.model.getProperty('playerTwoScore');
  };

  View.prototype.clearBoard = function () {

    // Remove the result banner from view
    const resultBanner = document.getElementById('js-ttt-end-result');
    resultBanner.style.display = 'none';

    const buttonNodes = document.querySelectorAll('.c-board__btn');
    [...buttonNodes].forEach((buttonNode) => {
      buttonNode.style.removeProperty('color');
      buttonNode.removeAttribute('disabled');
      buttonNode.innerHTML = buttonNode.id.substr(11);
    });
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
      case 'onReset':
        window.addEventListener('click', (ev) => {
          if (ev.target && ev.target.id) {
            if (ev.target.id.toLowerCase() === 'js-ttt-btn-reset' && this.gameSetupStage === false) {
              ev.stopPropagation();
              subscriber();
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
