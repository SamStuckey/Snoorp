const Game = require('./game');

let game;

// const resetButton = document.getElementById("reset");
// resetButton.addEventListener('click', () => {
//   game = new Game();
//   game.play();
// });

document.addEventListener("DOMContentLoaded", () => {
  game = new Game();
  game.play();
});
