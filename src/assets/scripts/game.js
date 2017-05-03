(function (window) {
  'use strict';

  /*
   * Constructs a game object to be played
   * @param autoPlayer [AIPlayer] : the AI player to be play the game with
   */
  function Game(constroller) {
    this.controller = constroller;

    // public : initialize the ai player for this game
    this.ai = new window.ttt.AIPlayer();

    // public : initialize the game current state to empty board configuration
    this.currentState = new window.ttt.State();

    // "E" stands for empty board cell
    this.currentState.board = [
      'E', 'E', 'E',
      'E', 'E', 'E',
      'E', 'E', 'E',
    ];

    this.currentState.turn = 'X'; // X plays first

    /*
     * initialize game status to beginning
     */
    this.status = 'beginning';

    /*
     * public function that advances the game to a new state
     * @param _state [State]: the new state to advance the game to
     */
    this.advanceTo = function (_state) {
      this.currentState = _state;

      if (_state.isTerminal()) {
        this.status = 'ended';

        if (_state.result === 'X-won') {
          // X won
          this.controller.updateView('won');
          // view.switchViewTo('won');
        }
        else if (_state.result === 'O-won') {
          // X lost
          this.controller.updateView('lost');
          // view.switchViewTo('lost');
        }
        else {
          // it's a draw
          this.controller.updateView('draw');
          // view.switchViewTo('draw');
        }
      }
      else {
        // the game is still running

        if (this.currentState.turn === 'X') {
          this.controller.updateView('human');
          // view.switchViewTo('human');
        }
        else {
          this.controller.updateView('robot');
          // view.switchViewTo('robot');

          // notify the AI player its turn has come up
          this.ai.notify('O');
        }
      }
    };

    /*
     * starts the game
     */
    this.start = function () {
      if (this.status === 'beginning') {
        this.ai.plays(this);
        // invoke advanceTo with the initial state
        this.advanceTo(this.currentState);
        this.status = 'running';
      }
    };
  }

  /*
   * public static function that calculates the score of the x player in a given terminal state
   * @param _state [State]: the state in which the score is calculated
   * @return [Number]: the score calculated for the human player
   */
  Game.prototype.score = function (_state) {
    if (_state.result === 'X-won') {
      // the x player won
      return 10 - _state.oMovesCount;
    } else if (_state.result === 'O-won') {
      // the x player lost
      return -10 + _state.oMovesCount;
    } else {
      // it's a draw
      return 0;
    }
  };

  window.ttt = window.ttt || {};
  window.ttt.Game = Game;
})(window);
