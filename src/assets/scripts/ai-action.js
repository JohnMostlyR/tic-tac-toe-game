(function (window) {
  'use strict';

  /*
   * Constructs an action that the ai player could make
   * @param pos [Number]: the cell position the ai would make its action in
   * made that action
   */
  function AIAction(position) {

    // public : the position on the board that the action would put the letter on
    this.movePosition = position;

    // public : the minimax value of the state that the action leads to when applied
    this.minimaxVal = 0;

    /*
     * public : applies the action to a state to get the next state
     * @param state [State]: the state to apply the action to
     * @return [State]: the next state
     */
    this.applyTo = function (state) {
      const next = new window.ttt.State(state);

      // put the letter on the board
      next.board[this.movePosition] = state.whoseTurn;

      if (state.whoseTurn === 'O') {
        next.numberOfComputerMoves += 1;
      }

      next.advanceTurn();

      return next;
    };
  }

  window.ttt = window.ttt || {};
  window.ttt.AIAction = AIAction;
})(window);
