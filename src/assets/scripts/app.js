(function () {
  'use strict';

  function TicTacToe() {
    this.model = new ttt.Model();
    this.view = new ttt.View(this.model);
    this.controller = new ttt.Controller(this.model, this.view);
  }

  let newTicTacToe = new TicTacToe();

  newTicTacToe.view.subscribe('onReset', () => {
    newTicTacToe = null;
    newTicTacToe = new TicTacToe();
  });
})();
