(function () {
  'use strict';

  function TicTacToe() {
    this.model = new ttt.Model();
    this.view = new ttt.View(this.model);
    this.controller = new ttt.Controller(this.model, this.view);
  }

  let newTicTacToe = new TicTacToe();

  window.addEventListener('click', (ev) => {
    if (ev.target && ev.target.id) {
      if (ev.target.id.toLowerCase() === 'js-ttt-btn-reset') {
        ev.stopPropagation();
        newTicTacToe = null;
        window.location.reload(true);
      }
    }
  }, true);
})();
