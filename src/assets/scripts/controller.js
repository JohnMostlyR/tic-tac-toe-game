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

    this.model.subscribe('status', (status) => {
      //
    });
  }

  /*
   * start game (onclick div.start) behavior and control
   * when start is clicked and a level is chosen, the game status changes to "running"
   * and UI view to switched to indicate that it's human's trun to play
   */
  Controller.prototype.startNewGame = function () {
    console.info('Starting');
    this.game = new window.ttt.Game(this);
    this.game.startNewGame();
  };

  Controller.prototype.claimCell = function (cell, turn) {
    console.info(`Claim cell: ${cell} for player: ${turn}`);
    this.view.claimCell(cell, turn);
  };

  Controller.prototype.clickOnCell = function (cell) {
    if (this.game && this.game.status === 'running' && this.game.currentState.whoseTurn === 'X') {
      const next = new window.ttt.State(this.game.currentState);

      next.board[cell] = this.game.currentState.whoseTurn;
      this.claimCell(cell, this.game.currentState.whoseTurn);

      next.switchTurns();
      this.game.advanceTo(next);
    }
  };

  Controller.prototype.updateView = function (show) {
    console.info(`Update view to show: ${show}`);
    this.view.switchViewTo(show);
  };

  window.ttt = window.ttt || {};
  window.ttt.Controller = Controller;
})(window);
