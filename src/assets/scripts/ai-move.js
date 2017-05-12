(function (window) {
  'use strict';

  /**
   * Creates a new AIMove, a possible move the computer could make (the node in a game tree).
   * @param {number} position - A free position on the board.
   * @constructor
   */
  function AIMove(position) {
    this.movePosition = position;
    this.minimaxValue = 0;

    /**
     * @method addState
     * @param {State} state
     * @return {State}
     */
    this.addState = function (state) {
      const nextState = new window.ttt.State(state);

      // put the letter on the board
      nextState.board[this.movePosition] = state.whoseTurn;

      // Computer is always player-two
      if (state.whoseTurn === 'player-two') {
        nextState.numberOfComputerMoves += 1;
      }

      nextState.switchTurns();

      return nextState;
    };
  }

  window.ttt = window.ttt || {};
  window.ttt.AIMove = AIMove;
})(window);
