(function (window) {
  'use strict';

  /**
   * Creates a new AIPlayer
   * @constructor
   */
  function AIPlayer() {
    this.currentGame = {};

    /**
     * @method determineBestMove
     * @description Implementation of the minimax algorithm
     * @param {Object} state - A game state to calculate the minimax value for
     * @return {number} - The calculated minimax value for this state
     * @private
     * @see {@link https://en.wikipedia.org/wiki/Minimax|Minimax}
     */
    const determineBestMove = (state) => {
      if (state.checkForTerminalState()) {
        return this.currentGame.calculateScore(state);
      } else {

        /**
         * Will later hold the minimax value to return.
         * @type {number}
         */
        let bestValue = 0;

        // Initialize the score with the worst possible value so we can only go better from here
        if (state.whoseTurn === 'player-one') {
          // 'player one' is the maximizing player
          bestValue = Number.NEGATIVE_INFINITY;
        } else {
          // 'player two' is the minimizing player
          bestValue = Number.POSITIVE_INFINITY;
        }

        const freePositions = state.getFreePositions();

        // Find next available states using the info from all still available positions.
        const possibleNextMoves = freePositions.map((position) => {
          const newPossibleMove = new window.ttt.AIMove(position);
          return newPossibleMove.addState(state);
        });

        // Calculate the minimax value for all available next states and evaluate the current state's value.
        possibleNextMoves.forEach((possibleMove) => {
          const newValue = determineBestMove(possibleMove);

          if (state.whoseTurn === 'player-one') {
            if (newValue > bestValue) {
              bestValue = newValue;
            }
          } else {
            if (newValue < bestValue) {
              bestValue = newValue;
            }
          }
        });

        return bestValue;
      }
    };

    /**
     * @method sortAscending
     * @description Sorting function for sorting all possible moves in an ascending manner.
     * @param {Object} firstMove
     * @param {Object} secondMove
     * @return {number}
     * @private
     */
    const sortAscending = function (firstMove, secondMove) {
      if (firstMove.minimaxValue < secondMove.minimaxValue) {
        return -1;
      } else if (firstMove.minimaxValue > secondMove.minimaxValue) {
        return 1;
      } else {
        return 0;
      }
    };

    /**
     * @method sortDescending
     * @description Sorting function for sorting all possible moves in an descending manner.
     * @param {Object} firstMove
     * @param {Object} secondMove
     * @return {number}
     * @private
     */
    const sortDescending = function (firstMove, secondMove) {
      if (firstMove.minimaxValue > secondMove.minimaxValue) {
        return -1;
      } else if (firstMove.minimaxValue < secondMove.minimaxValue) {
        return 1;
      } else {
        return 0;
      }
    };

    /**
     * @method makeAMove
     * @param {string} whoseTurn - 'player-one' or 'player-two'
     * @private
     */
    const makeAMove = (whoseTurn) => {
      const freePositions = this.currentGame.currentState.getFreePositions();

      // Determine the best move for all still available positions.
      const possibleMoves = freePositions.map((position) => {

        // Instantiate a new possible move.
        const newPossibleMove = new window.ttt.AIMove(position);

        // Add the current state to it.
        const newState = newPossibleMove.addState(this.currentGame.currentState);

        // For this state determine the best move.
        newPossibleMove.minimaxValue = determineBestMove(newState);

        return newPossibleMove;
      });

      // Sort all possible actions based on the minimax score.
      if (whoseTurn === 'player-one') {
        possibleMoves.sort(sortDescending);
      } else {
        possibleMoves.sort(sortAscending);
      }

      // Take the first action as this is the best option.
      const chosenAction = possibleMoves[0];

      // Update the state.
      const nextState = chosenAction.addState(this.currentGame.currentState);

      // Tell the view.
      this.currentGame.controller.claimCell(chosenAction.movePosition, 'player-two');

      // Advance the game.
      this.currentGame.advanceTo(nextState);
    };


    /**
     * @method setGame
     * @param {Object} game
     * @public
     */
    this.setGame = function (game) {
      this.currentGame = game;
    };


    /**
     * @method notifyMe
     * @param {string} whoseTurn - 'player-one' or 'player-two'
     * @public
     */
    this.notifyMe = function (whoseTurn) {

      // Add some 'thinking' time
      const thinkingTime = 1000;
      let thinkingTimerId = window.setTimeout(() => {
        makeAMove(whoseTurn);
      }, thinkingTime);
    };
  }

  window.ttt = window.ttt || {};
  window.ttt.AIPlayer = AIPlayer;
})(window);
