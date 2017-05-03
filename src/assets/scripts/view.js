(function (window) {
  'use strict';

  function View() {
    // holds the state of the initial controls visibility
    this.intialControlsVisible = true;

    // holds the current visible view
    this.currentView = '';
  }

  /*
   * switches the view on the UI depending on who's turn it switches
   * @param turn [String]: the player to switch the view to
   */
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

  /*
   * places X or O in the specified place in the board
   * @param i [Number] : row number (0-indexed)
   * @param j [Number] : column number (0-indexed)
   * @param symbol [String]: X or O
   */
  View.prototype.insertAt = function (indx, symbol) {
    const board = document.querySelectorAll('.cell');
    const targetCell = board[indx];

    if (!targetCell.classList.contains('occupied')) {
      targetCell.innerHTML = symbol;
      targetCell.style.color = (symbol === 'X') ? 'green' : 'red';
      targetCell.classList.add('occupied');
    }
  };

  View.prototype.subscribe = function (event, subscriber) {
    switch (event) {
      case 'onClickStart':
        window.addEventListener('click', (ev) => {
          if (ev.target) {
            if (ev.target.id === 'js-start') {
              subscriber();
            }
          }
        });
        break;
      case 'onClickCell':
        window.addEventListener('click', (ev) => {
          if (ev.target) {
            if (ev.target.classList.contains('cell')) {
              if (ev.target.classList.contains('occupied')) {
                return;
              }

              ev.stopPropagation();
              subscriber(ev.target.dataset.indx);
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
