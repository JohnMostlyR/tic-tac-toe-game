(function (window) {
  'use strict';

  function View() {
    // holds the state of the initial controls visibility
    this.intialControlsVisible = true;

    // holds the current visible view
    this.currentView = '';
  }

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

  View.prototype.claimCell = function (idx, avatar) {
    const targetCell = document.getElementById(`js-ttt-btn-${idx}`);
    targetCell.innerHTML = avatar;
    targetCell.setAttribute('disabled', 'disabled');
  };

  View.prototype.subscribe = function (event, subscriber) {
    switch (event) {
      case 'onClickStart':
        window.addEventListener('click', (ev) => {
          if (ev.target) {
            if (ev.target.id === 'js-ttt-start') {
              subscriber();
            }
          }
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
