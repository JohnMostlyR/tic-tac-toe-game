/*
 * ui object encloses all UI related methods and attributes
 */
var view = {};

// holds the state of the initial controls visibility
view.intialControlsVisible = true;

// holds the current visible view
view.currentView = '';

/*
 * switches the view on the UI depending on who's turn it switches
 * @param turn [String]: the player to switch the view to
 */
view.switchViewTo = function (turn) {

  // helper function for async calling
  function _switch(_turn) {
    console.info(`#${_turn}`);
    view.currentView = document.querySelector(`#${_turn}`);
    view.currentView.style.display = 'block';
  }

  if (view.intialControlsVisible) {
    // if the game is just starting
    view.intialControlsVisible = false;
    document.querySelector('.initial').style.display = 'none';
    _switch(turn);
  }
  else {
    //if the game is in an intermediate state
    view.currentView.style.display = 'none';
    _switch(turn);
  }
};

/*
 * places X or O in the specified place in the board
 * @param i [Number] : row number (0-indexed)
 * @param j [Number] : column number (0-indexed)
 * @param symbol [String]: X or O
 */
view.insertAt = function (indx, symbol) {
  const board = document.querySelectorAll('.cell');
  const targetCell = board[indx];

  if (!targetCell.classList.contains('occupied')) {
    targetCell.innerHTML = symbol;
    targetCell.style.color = (symbol === 'X') ? 'green' : 'red';
    targetCell.classList.add('occupied');
  }
};
