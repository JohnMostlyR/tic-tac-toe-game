(function (window) {
  'use strict';

  /*
   * Represents a state in the game
   * @param old [State]: old state to intialize the new state
   */
  function State(old) {

    /*
     * public : the player who has the turn to player
     */
    this.turn = '';

    /*
     * public : the number of moves of the AI player
     */
    this.oMovesCount = 0;

    /*
     * public : the result of the game in this State
     */
    this.result = 'still running';

    /*
     * public : the board configuration in this state
     */
    this.board = [];

    /* Begin Object Construction */
    if (typeof old === 'object') {
      // if the state is constructed using a copy of another state
      this.board = old.board.concat();
      this.oMovesCount = old.oMovesCount;
      this.result = old.result;
      this.turn = old.turn;
    }
    /* End Object Construction */
  }

  /*
   * public : advances the turn in a the state
   */
  State.prototype.advanceTurn = function () {
    this.turn = this.turn === 'X' ? 'O' : 'X';
  };

  /*
   * public function that enumerates the empty cells in state
   * @return [Array]: indices of all empty cells
   */
  State.prototype.emptyCells = function () {
    return this.board.reduce((acc, cell, idx) => {
      return (cell === 'E') ? acc.concat(idx) : acc;
    }, []);
  };

  /*
   * public  function that checks if the state is a terminal state or not
   * the state result is updated to reflect the result of the game
   * @returns [Boolean]: true if it's terminal, false otherwise
   */

  State.prototype.isTerminal = function () {
    const BOARD = this.board;

    // check rows
    for (let i = 0; i <= 6; i += 3) {
      if (BOARD[i] !== 'E' && BOARD[i] === BOARD[i + 1] && BOARD[i + 1] === BOARD[i + 2]) {
        this.result = `${BOARD[i]}-won`; // update the state result
        return true;
      }
    }

    // check columns
    for (let i = 0; i <= 2; i += 1) {
      if (BOARD[i] !== 'E' && BOARD[i] === BOARD[i + 3] && BOARD[i + 3] === BOARD[i + 6]) {
        this.result = `${BOARD[i]}-won`; // update the state result
        return true;
      }
    }

    // check diagonals
    for (let i = 0, j = 4; i <= 2; i += 2, j -= 2) {
      if (BOARD[i] !== 'E' && BOARD[i] === BOARD[i + j] && BOARD[i + j] === BOARD[i + (2 * j)]) {
        this.result = `${BOARD[i]}-won`; // update the state result
        return true;
      }
    }

    const available = this.emptyCells();

    if (available.length === 0) {
      // the game is draw
      this.result = 'draw'; // update the state result
      return true;
    }

    return false;
  };

  window.ttt = window.ttt || {};
  window.ttt.State = State;
})(window);
