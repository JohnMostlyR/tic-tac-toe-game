(function (window) {
  'use strict';

  function AIMove(position) {
    this.movePosition = position;
    this.minimaxValue = 0;

    this.addState = function (state) {
      const nextState = new window.ttt.State(state);

      // put the letter on the board
      nextState.board[this.movePosition] = state.whoseTurn;

      if (state.whoseTurn === 'O') {
        nextState.numberOfComputerMoves += 1;
      }

      nextState.switchTurns();

      return nextState;
    };
  }

  window.ttt = window.ttt || {};
  window.ttt.AIMove = AIMove;
})(window);
