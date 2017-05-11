(function (window) {
  'use strict';

  function State(previousState) {
    this.board = [];
    this.whoseTurn = '';
    this.result = 'still running';
    this.numberOfComputerMoves = 0;

    if (typeof previousState === 'object') {
      this.board = previousState.board.concat();
      this.whoseTurn = previousState.whoseTurn;
      this.result = previousState.result;
      this.numberOfComputerMoves = previousState.numberOfComputerMoves;
    }
  }

  State.prototype.switchTurns = function () {
    this.whoseTurn = this.whoseTurn === 'player-one' ? 'player-two' : 'player-one';
  };

  State.prototype.getFreePositions = function () {
    return this.board.reduce((acc, cell, idx) => {
      return (cell === 'E') ? acc.concat(idx) : acc;
    }, []);
  };

  State.prototype.checkForTerminalState = function () {
    const BOARD = this.board;

    // check rows
    for (let i = 0; i <= 6; i += 3) {
      if (
        BOARD[i] !== 'E' &&
        BOARD[i] === BOARD[i + 1] &&
        BOARD[i + 1] === BOARD[i + 2]
      ) {
        this.result = {
          winner: `${BOARD[i]}-won`,
          positions: [i, i + 1, i + 2],
        };

        return true;
      }
    }

    // check columns
    for (let i = 0; i <= 2; i += 1) {
      if (
        BOARD[i] !== 'E' &&
        BOARD[i] === BOARD[i + 3] &&
        BOARD[i + 3] === BOARD[i + 6]
      ) {
        this.result = {
          winner: `${BOARD[i]}-won`,
          positions: [i, i + 3, i + 6],
        };

        return true;
      }
    }

    // check diagonals
    for (let i = 0, j = 4; i <= 2; i += 2, j -= 2) {
      if (
        BOARD[i] !== 'E' &&
        BOARD[i] === BOARD[i + j] &&
        BOARD[i + j] === BOARD[i + (2 * j)]
      ) {
        this.result = {
          winner: `${BOARD[i]}-won`,
          positions: [i, i + j, i + (2 * j)],
        };

        return true;
      }
    }

    const freePositions = this.getFreePositions();

    if (freePositions.length === 0) {
      this.result = {
        winner: 'draw',
        positions: [],
      };

      return true;
    }

    return false;
  };

  window.ttt = window.ttt || {};
  window.ttt.State = State;
})(window);
