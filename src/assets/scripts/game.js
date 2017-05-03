(function (window) {
  'use strict';

  function Game(controller) {
    this.controller = controller;
    this.currentState = new window.ttt.State();
    this.currentState.board = [
      'E', 'E', 'E',
      'E', 'E', 'E',
      'E', 'E', 'E',
    ];
    this.currentState.whoseTurn = 'X';
    this.aiPlayer = new window.ttt.AIPlayer();
    this.status = 'beginning';

    this.advanceTo = function (newState) {
      this.currentState = newState;

      if (newState.checkForTerminalState()) {
        this.status = 'ended';

        if (newState.result === 'X-won') {
          this.controller.updateView('won');
        } else if (newState.result === 'O-won') {
          this.controller.updateView('lost');
        } else {
          this.controller.updateView('draw');
        }
      } else {
        if (this.currentState.whoseTurn === 'X') {
          this.controller.updateView('human');
        } else {
          this.controller.updateView('robot');

          // notify the AI player its turn has come up
          this.aiPlayer.notify('O');
        }
      }
    };

    this.startNewGame = function () {
      if (this.status === 'beginning') {
        this.aiPlayer.setGame(this);
        // invoke advanceTo with the initial state
        this.advanceTo(this.currentState);
        this.status = 'running';
      }
    };
  }

  Game.prototype.calculateScore = function (finalState) {
    if (finalState.result === 'X-won') {
      return 10 - finalState.numberOfComputerMoves;
    } else if (finalState.result === 'O-won') {
      return -10 + finalState.numberOfComputerMoves;
    }

    return 0;
  };

  window.ttt = window.ttt || {};
  window.ttt.Game = Game;
})(window);
