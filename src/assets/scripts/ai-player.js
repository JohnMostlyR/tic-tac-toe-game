(function (window) {
  'use strict';

  /*
   * Constructs an AI player with a specific level of intelligence
   * @param level [String]: the desired level of intelligence
   */
  function AIPlayer() {

    // private attribute: the game the player is playing
    this.currentGame = {};

    /*
     * private recursive function that computes the minimax value of a game state
     * @param state [State] : the state to calculate its minimax value
     * @returns [Number]: the minimax value of the state
     */
    const minimaxValue = (state) => {
      if (state.checkForTerminalState()) {
        // a terminal game state is the base case
        // return this.game.score(state);
        return this.currentGame.score(state);
      } else {
        let stateScore = 0; // this stores the minimax value we'll compute

        if (state.whoseTurn === 'X') {
          // X wants to maximize --> initialize to a value smaller than any possible score
          stateScore = -1000;
        } else {
          // O wants to minimize --> initialize to a value larger than any possible score
          stateScore = 1000;
        }

        const availablePositions = state.getFreePositions();

        // enumerate next available states using the info form available positions
        const availableNextStates = availablePositions.map((position) => {
          const action = new window.ttt.AIAction(position);

          const nextState = action.applyTo(state);

          return nextState;
        });

        /* calculate the minimax value for all available next states
         * and evaluate the current state's value */
        availableNextStates.forEach((nextState) => {
          const nextScore = minimaxValue(nextState);

          if (state.whoseTurn === 'X') {
            // X wants to maximize --> update stateScore iff nextScore is larger
            if (nextScore > stateScore) {
              stateScore = nextScore;
            }
          } else {
            // O wants to minimize --> update stateScore iff nextScore is smaller
            if (nextScore < stateScore) {
              stateScore = nextScore;
            }
          }
        });

        return stateScore;
      }
    };

    /*
     * public static function that defines a rule for sorting AIActions in ascending manner
     * @param firstAction [AIAction] : the first action in a pairwise sort
     * @param secondAction [AIAction]: the second action in a pairwise sort
     * @return [Number]: -1, 1, or 0
     */
    const sortAscending = function (firstAction, secondAction) {
      if (firstAction.minimaxVal < secondAction.minimaxVal) {
        return -1; // indicates that firstAction goes before secondAction
      } else if (firstAction.minimaxVal > secondAction.minimaxVal) {
        return 1; // indicates that secondAction goes before firstAction
      } else {
        return 0; // indicates a tie
      }
    };

    /*
     * public static function that defines a rule for sorting AIActions in descending manner
     * @param firstAction [AIAction] : the first action in a pairwise sort
     * @param secondAction [AIAction]: the second action in a pairwise sort
     * @return [Number]: -1, 1, or 0
     */
    const sortDescending = function (firstAction, secondAction) {
      if (firstAction.minimaxVal > secondAction.minimaxVal) {
        return -1; // indicates that firstAction goes before secondAction
      } else if (firstAction.minimaxVal < secondAction.minimaxVal) {
        return 1; // indicates that secondAction goes before firstAction
      } else {
        return 0; // indicates a tie
      }
    };

    /*
     * private function: make the ai player take a master move,
     * that is: choose the optimal minimax decision
     * @param whoseTurn [String]: the player to play, either X or O
     */
    const takeAMasterMove = (turn) => {
      const available = this.currentGame.currentState.getFreePositions();

      // enumerate and calculate the score for each available actions to the ai player
      const availableActions = available.map((position) => {
        const action = new window.ttt.AIAction(position); // create the action object
        const next = action.applyTo(this.currentGame.currentState); // get next state by applying the action

        action.minimaxVal = minimaxValue(next); // calculate and set the action's minmax value

        return action;
      });

      console.info('availableActions: ', availableActions);

      // sort the enumerated actions list by score
      if (turn === 'X') {
        // X maximizes --> sort the actions in a descending manner to have the action with maximum minimax at first
        availableActions.sort(sortDescending);
      } else {
        // O minimizes --> sort the actions in an ascending manner to have the action with minimum minimax at first
        availableActions.sort(sortAscending);
      }


      // take the first action as it's the optimal
      const chosenAction = availableActions[0];
      const next = chosenAction.applyTo(this.currentGame.currentState);

      // this.view.insertAt(chosenAction.movePosition, whoseTurn);
      this.currentGame.controller.claimCell(chosenAction.movePosition, 'O');

      this.currentGame.advanceTo(next);
    };


    /*
     * public method to specify the game the ai player will play
     * @param _game [Game] : the game the ai will play
     */
    this.plays = function (_game) {
      this.currentGame = _game;
      console.info('currentGame: ', this.currentGame);
    };

    /*
     * public function: notify the ai player that it's its whoseTurn
     * @param whoseTurn [String]: the player to play, either X or O
     */
    this.notify = function (turn) {
      takeAMasterMove(turn);
    };
  }

  window.ttt = window.ttt || {};
  window.ttt.AIPlayer = AIPlayer;
})(window);
