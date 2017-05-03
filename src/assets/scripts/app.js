(function () {
  'use strict';

  function TicTacToe() {
    this.model = new ttt.Model();
    this.view = new ttt.View();
    this.controller = new ttt.Controller(this.model, this.view);
  }

  const newTicTacToe = new TicTacToe();
})();
