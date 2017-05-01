/*
 * object to contain all items accessable to all control functions
 */
var globals = {};

/*
 * start game (onclick div.start) behavior and control
 * when start is clicked and a level is chosen, the game status changes to "running"
 * and UI view to swicthed to indicate that it's human's trun to play
 */
const start = function () {
  console.info('Starting');
  const aiPlayer = new AI();
  globals.game = new Game(aiPlayer);

  aiPlayer.plays(globals.game);

  globals.game.start();
};

const clickOnCell = function (cell) {
  if (globals.game.status === 'running' && globals.game.currentState.turn === 'X') {
    const indx = parseInt(cell);
    const next = new State(globals.game.currentState);

    next.board[indx] = 'X';
    view.insertAt(indx, 'X');

    next.advanceTurn();
    globals.game.advanceTo(next);
  }
};

window.addEventListener('click', (ev) => {
  if (ev.target) {
    if (ev.target.id === 'js-start') {
      start();
    } else if (ev.target.classList.contains('cell')) {
      if (ev.target.classList.contains('occupied')) {
        return;
      }

      ev.stopPropagation();
      clickOnCell(ev.target.dataset.indx);
    }
  }
});
