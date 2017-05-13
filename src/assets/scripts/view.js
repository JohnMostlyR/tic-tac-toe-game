(function (window) {
  'use strict';

  /**
   * Reference to window.document
   * @type {HTMLDocument}
   */
  const document = window.document;

  /**
   * Created a new View
   * @param {Model} model
   * @constructor
   */
  function View(model) {
    this.model = model;
    this.form = document.getElementById('js-ttt-preferences-form');

    this.currentElementNode = null;

    this.showSetupStage();
  }

  /**
   * @method showSetupStage
   * @description Display a form where the user can choose preferences for the game to play.
   * @public
   */
  View.prototype.showSetupStage = function () {
    this.gameSetupStage = true;

    // Show the form for adding preferences.
    const submitBtn = this.form.querySelector('input[type="submit"');
    submitBtn.setAttribute('disabled', 'disabled');
    submitBtn.style.opacity = 0;

    this.form.reset();
    this.form.style.removeProperty('width');
    this.form.style.opacity = 1;

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

  /**
   * @method showGameStage
   * @description Show the stage for the game.
   * @public
   */
  View.prototype.showGameStage = function () {
    this.gameSetupStage = false;

    // Show the form for adding preferences.
    this.form.style.opacity = 0;

    // Make room for the game board.
    this.form.style.width = 0;

    // Show scores for human player two or computer depending on the game type, which can be one player or two players.
    const gameType = this.model.getProperty('gameType');

    // Depending on the game type the score board should read the score for 'Player two' or 'Computer'.
    if (gameType === 2) {

      // Two players game.
      document.getElementById('js-ttt-show-score-computer').style.display = 'none';
      document.getElementById('js-ttt-show-score-human').style.removeProperty('display');
    } else {

      // One against computer
      document.getElementById('js-ttt-show-score-human').style.display = 'none';
      document.getElementById('js-ttt-show-score-computer').style.removeProperty('display');
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

  /**
   * @method showResult
   * @description Show the result when the game has ended.
   * @param {string} result - Describes the winner or a draw.
   * @param {Array} positions - An array with ID's of the positions that makes up the winning row.
   * @public
   */
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
    resultBanner.classList.add('l-end-result--show');

    // update the score boards
    document.getElementById('js-ttt-show-player-one-score').innerHTML = this.model.getProperty('playerOneScore');
    document.getElementById('js-ttt-show-player-two-score').innerHTML = this.model.getProperty('playerTwoScore');
  };

  /**
   * @method clearBoard
   * @description Set the game board to its initial state.
   * @public
   */
  View.prototype.clearBoard = function () {

    // Remove the result banner from view
    const resultBanner = document.getElementById('js-ttt-end-result');
    resultBanner.classList.remove('l-end-result--show');

    const buttonNodes = document.querySelectorAll('.c-board__btn');

    [...buttonNodes].forEach((buttonNode) => {
      buttonNode.style.removeProperty('color');
      buttonNode.removeAttribute('disabled');

      // Remove all placed 'X-es' and 'O's' with something neutral.
      // Leaving the button 'empty' will screw up the layout of the board.
      buttonNode.innerHTML = String.fromCodePoint(0x02297); // Circled times operator
    });
  };

  /**
   * @method updateView
   * @description Shows/hides an element by the given ID
   * @param {string} elementId - The ID without namespacing.
   * @public
   */
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

  /**
   * @method enableStartButton
   * @description Enable the start button. This should be disabled until all form requirements are met.
   * @public
   */
  View.prototype.enableStartButton = function () {
    const submitBtn = this.form.querySelector('input[type="submit"');
    submitBtn.removeAttribute('disabled');
    submitBtn.style.removeProperty('opacity');
  };

  /**
   * @method claimCell
   * @description Claim this cell for the current player.
   * @param {number} idx - The cell its position on the board.
   * @param {string} avatar - 'X' or 'O', depending on the preference that has been set.
   * @public
   */
  View.prototype.claimCell = function (idx, avatar) {
    const targetCell = document.getElementById(`js-ttt-btn-${idx}`);
    targetCell.innerHTML = avatar;
    targetCell.setAttribute('disabled', 'disabled');
  };

  /**
   * @method subscribe
   * @description Subscribe for events.
   * @param {string} event - Description of the event to subscribe to.
   * @param {Function} subscriber - The function to call.
   */
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
              const idx = parseInt(ev.target.id.substr(11));

              if (isNaN(idx)) {
                return;
              }

              ev.stopPropagation();
              subscriber(idx);
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
