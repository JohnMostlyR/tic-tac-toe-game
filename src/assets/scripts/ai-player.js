(function (window) {
  'use strict';

  function AIPlayer() {
    this.currentGame = {};

    const determineBestMove = (state) => {
      if (state.checkForTerminalState()) {
        return this.currentGame.calculateScore(state);
      } else {
        let bestValue = 0;

        if (state.whoseTurn === 'player-one') {
          bestValue = Number.NEGATIVE_INFINITY;
        } else {
          bestValue = Number.POSITIVE_INFINITY;
        }

        const freePositions = state.getFreePositions();

        const possibleNextMoves = freePositions.map((position) => {
          const newPossibleMove = new window.ttt.AIMove(position);
          return newPossibleMove.addState(state);
        });

        /* calculate the minimax value for all available next states
         * and evaluate the current state's value */
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

    const sortAscending = function (firstMove, secondMove) {
      if (firstMove.minimaxValue < secondMove.minimaxValue) {
        return -1;
      } else if (firstMove.minimaxValue > secondMove.minimaxValue) {
        return 1;
      } else {
        return 0;
      }
    };

    const sortDescending = function (firstMove, secondMove) {
      if (firstMove.minimaxValue > secondMove.minimaxValue) {
        return -1;
      } else if (firstMove.minimaxValue < secondMove.minimaxValue) {
        return 1;
      } else {
        return 0;
      }
    };

    const makeAMove = (whoseTurn) => {
      const freePositions = this.currentGame.currentState.getFreePositions();

      const possibleMoves = freePositions.map((position) => {
        const newPossibleMove = new window.ttt.AIMove(position);
        const newState = newPossibleMove.addState(this.currentGame.currentState);
        newPossibleMove.minimaxValue = determineBestMove(newState);

        return newPossibleMove;
      });

      if (whoseTurn === 'player-one') {
        possibleMoves.sort(sortDescending);
      } else {
        possibleMoves.sort(sortAscending);
      }

      // take the first action as it's the optimal
      const chosenAction = possibleMoves[0];
      const nextState = chosenAction.addState(this.currentGame.currentState);

      this.currentGame.controller.claimCell(chosenAction.movePosition, 'player-two');

      this.currentGame.advanceTo(nextState);
    };


    this.setGame = function (game) {
      this.currentGame = game;
      console.info('currentGame: ', this.currentGame);
    };

    this.notify = function (turn) {

      // Add some 'thinking' time
      const thinkingTime = 1500;
      let thinkingTimerId = window.setTimeout(() => {
        makeAMove(turn);
      }, thinkingTime);
    };
  }

  window.ttt = window.ttt || {};
  window.ttt.AIPlayer = AIPlayer;
})(window);
