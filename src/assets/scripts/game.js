(function (window) {
  'use strict';

  /**
   * Creates a new Game
   * @param {Controller} controller
   * @constructor
   */
  function Game(controller) {
    this.controller = controller;
    this.isOnePlayer = (this.controller.model.getProperty('gameType') === 1);
    this.currentState = new window.ttt.State();
    this.currentState.board = [
      'N', 'N', 'N',
      'N', 'N', 'N',
      'N', 'N', 'N',
    ];
    this.currentState.whoseTurn = 'player-one';

    // Instantiate a new AI Player when the game type is 'one player'.
    if (this.isOnePlayer) {
      this.aiPlayer = new window.ttt.AIPlayer();
    }

    this.status = 'beginning';

    /**
     * @method advanceTo
     * @description Advance the game to a new state.
     * @param {Object} newState
     */
    this.advanceTo = function (newState) {
      this.currentState = newState;

      if (newState.checkForTerminalState()) {
        this.status = 'ended';
        this.controller.showResult(newState.result);
      } else {
        if (this.currentState.whoseTurn === 'player-one') {
          this.controller.updateView('player-one-goes');
        } else {
          this.controller.updateView('player-two-goes');

          if (this.aiPlayer) {
            // notify the AI player it is its turn
            this.aiPlayer.notifyMe('player-two');
          }
        }
      }
    };

    /**
     * @method startNewGame
     */
    this.startNewGame = function () {
      if (this.status === 'beginning') {

        if (this.aiPlayer) {
          this.aiPlayer.setGame(this);
        }

        // invoke advanceTo with the initial state
        this.advanceTo(this.currentState);
        this.status = 'running';
      }
    };
  }

  /**
   * @method calculateScore
   * @param {Object} finalState
   * @return {number} The calculated score
   */
  Game.prototype.calculateScore = function (finalState) {
    if (finalState.result.winner === 'player-one-won') {
      return 10 - finalState.numberOfComputerMoves;
    } else if (finalState.result.winner === 'player-two-won') {
      return -10 + finalState.numberOfComputerMoves;
    }

    return 0;
  };

  window.ttt = window.ttt || {};
  window.ttt.Game = Game;
})(window);
