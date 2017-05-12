(function (window) {
  'use strict';

  /**
   * Creates a new Controller
   * @param {Model} model
   * @param {View} view
   * @constructor
   */
  function Controller(model, view) {
    this.model = model;
    this.view = view;
    this.game = null;

    // Subscribe to View events
    this.view.subscribe('onClickStart', () => {
      this.startNewGame();
    });

    this.view.subscribe('onClickCell', (cell) => {
      this.clickOnCell(cell);
    });

    this.view.subscribe('onEnterPreference', (name, value) => {
      const nameUpperCase = name.toUpperCase();
      const valueUpperCase = value.toUpperCase();

      if (nameUpperCase === 'GAME-TYPE') {
        this.setGameType(valueUpperCase);
      } else if (nameUpperCase === 'AVATAR') {
        this.setAvatar(valueUpperCase);
      }
    });

    // Subscribe to Model events
    this.model.subscribe('gameType', () => {
      this.enableStartButton();
    });

    this.model.subscribe('playerOneAvatar', () => {
      this.enableStartButton();
    });
  }

  /**
   * @method setGameType
   * @description Update the model with the chosen game type
   * @param {string|number} gameType - A '1' represents a one player game. A '2' represents a two player game.
   */
  Controller.prototype.setGameType = function (gameType) {
    this.model.setProperty('gameType', parseInt(gameType));
  };

  /**
   * @method setAvatar
   * @description Update the model with the chosen avatar.
   * @param {string} avatar - 'X' or 'O'.
   */
  Controller.prototype.setAvatar = function (avatar) {
    this.model.setProperty('playerOneAvatar', avatar);

    const playerTwoAvatar = avatar === 'X' ? 'O' : 'X';
    this.model.setProperty('playerTwoAvatar', playerTwoAvatar);
  };

  /**
   * @method enableStartButton
   * @description Tell the view to enable the start button when all form conditions are met.
   */
  Controller.prototype.enableStartButton = function () {
    if (!!this.model.getProperty('gameType') && !!this.model.getProperty('playerOneAvatar')) {
      this.view.enableStartButton();
    }
  };

  /**
   * @method startNewGame
   * @description Sets the game board to its original state. Shows the game stage and instantiate a new game.
   */
  Controller.prototype.startNewGame = function () {
    console.info('Starting');
    this.view.clearBoard();
    this.view.showGameStage();
    this.game = new window.ttt.Game(this);
    this.game.startNewGame();
  };

  /**
   * @method claimCell
   * @description Prepare the data for the view and tell it to show the cell is taken.
   * @param {number} cell - The position
   * @param {string} whoseTurn - 'player-one' or 'player-two'
   */
  Controller.prototype.claimCell = function (cell, whoseTurn) {
    console.info(`Claim cell: ${cell} for player: ${whoseTurn}`);

    const avatar = (whoseTurn === 'player-one')
      ?
      this.model.getProperty('playerOneAvatar')
      :
      this.model.getProperty('playerTwoAvatar');

    this.view.claimCell(cell, avatar);
  };

  /**
   * @method clickOnCell
   * @description Handle a click event on the game board.
   * @param {number} cell
   */
  Controller.prototype.clickOnCell = function (cell) {
    if (this.game && this.game.status === 'running') {
      if (this.game.currentState.whoseTurn === 'player-one' || this.model.getProperty('gameType') === 2) {
        // Only process when player one has its turn, in a one player game.

        // Instantiate a new State with the current game its state
        const next = new window.ttt.State(this.game.currentState);

        // Claim the chosen cell
        next.board[cell] = this.game.currentState.whoseTurn;
        this.claimCell(cell, this.game.currentState.whoseTurn);

        next.switchTurns();
        this.game.advanceTo(next);
      }
    }
  };

  /**
   * @method updateView
   * @description Tell the view to show an element
   * @param {string} show - The ID of the element to show, without any namespacing!
   */
  Controller.prototype.updateView = function (show) {
    this.view.updateView(show);
  };

  /**
   * @method showResult
   * @description Tells the view to show the game its end result and starts a new game after a time out.
   * @param {Object} result
   * @param {string} result.winner - 'player-one-won', 'player-two-won' or 'draw'.
   * @param {Array} result.positions - Holds the positions of the cells for the winning row.
   */
  Controller.prototype.showResult = function (result) {
    const winningPositions = result.positions.map((position) => {
      return `js-ttt-btn-${position}`;
    });

    let resultString = '';
    const scores = {};

    if (result.winner === 'player-one-won') {
      let oldScore = this.model.getProperty('playerOneScore');
      this.model.setProperty('playerOneScore', oldScore += 1);

      resultString = 'Player One Wins!';
    } else if (result.winner === 'player-two-won') {
      let oldScore = this.model.getProperty('playerTwoScore');
      this.model.setProperty('playerTwoScore', oldScore += 1);

      resultString = (this.model.getProperty('gameType') === 2) ? 'Sorry, Computer Wins' : 'Player Two Wins!';
    } else {
      resultString = 'It\'s a Draw';
    }


    this.view.showResult(resultString, winningPositions);

    // Start a new game after a timeout
    const timeToWait = 5000;
    const timeOutId = window.setTimeout(() => {
      this.startNewGame();
    }, timeToWait);
  };

  window.ttt = window.ttt || {};
  window.ttt.Controller = Controller;
})(window);
