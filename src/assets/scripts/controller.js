(function (window) {
  'use strict';

  function Controller(model, view) {
    this.model = model;
    this.view = view;
    this.game = null;

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

    this.model.subscribe('gameType', () => {
      this.enableStartButton();
    });

    this.model.subscribe('playerOneAvatar', () => {
      this.enableStartButton();
    });
  }

  Controller.prototype.setGameType = function (gameType) {
    this.model.setProperty('gameType', parseInt(gameType));
  };

  Controller.prototype.setAvatar = function (avatar) {
    this.model.setProperty('playerOneAvatar', avatar);

    const playerTwoAvatar = avatar === 'X' ? 'O' : 'X';
    this.model.setProperty('playerTwoAvatar', playerTwoAvatar);
  };

  Controller.prototype.enableStartButton = function () {
    if (this.model.getProperty('gameType') && this.model.getProperty('playerOneAvatar')) {
      this.view.enableStartButton();
    }
  };

  /*
   * start game (onclick div.start) behavior and control
   * when start is clicked and a level is chosen, the game status changes to "running"
   * and UI view to switched to indicate that it's human's trun to play
   */
  Controller.prototype.startNewGame = function () {
    console.info('Starting');
    this.view.showGameStage();
    this.game = new window.ttt.Game(this);
    this.game.startNewGame();
  };

  Controller.prototype.claimCell = function (cell, whoseTurn) {
    console.info(`Claim cell: ${cell} for player: ${whoseTurn}`);

    const avatar = (whoseTurn === 'player-one')
      ?
      this.model.getProperty('playerOneAvatar')
      :
      this.model.getProperty('playerTwoAvatar');

    this.view.claimCell(cell, avatar);
  };

  Controller.prototype.clickOnCell = function (cell) {
    if (this.game && this.game.status === 'running') {
      if (this.game.currentState.whoseTurn === 'player-one' || this.model.getProperty('gameType') === 2) {
        const next = new window.ttt.State(this.game.currentState);

        next.board[cell] = this.game.currentState.whoseTurn;
        this.claimCell(cell, this.game.currentState.whoseTurn);

        next.switchTurns();
        this.game.advanceTo(next);
      }
    }
  };

  Controller.prototype.updateView = function (show) {
    console.info(`Update view to show: ${show}`);
    this.view.updateView(show);
  };

  window.ttt = window.ttt || {};
  window.ttt.Controller = Controller;
})(window);
