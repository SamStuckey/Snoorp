const Cannon = require('./cannon');
const Board = require('./board');
const Snoorp = require('./snoorp');


const gameCanvas = document.getElementById("gameCanvas");
const canvasLeft = gameCanvas.offsetLeft;
const canvasTop = gameCanvas.offsetTop;
const scoreCanvas = document.getElementById("scoreCanvas");
const resetButton = document.getElementById('reset');

const ctx = gameCanvas.getContext("2d");
const ctxScore = scoreCanvas.getContext("2d");
const snoorpSize = 25;

const winImage = new Image();
winImage.src = "./images/win_text.png";

const lossImage = new Image();
lossImage.src = "./images/loss_text.png";

const board = new Image();
board.src = './images/wood.png';

const playAgain = new Image();
playAgain.src = './images/play_again.png';

let score = 0;
let numShots = 0;
class Game {
  constructor () {
    this.launchSnoorp = this.newSnoorp();
    this.cannon = this.newCannon();
    this.board = this.newBoard();
    resetButton.addEventListener('click', this.resetGame.bind(this));
  }

  newBoard () {
    return new Board({
      canvas: gameCanvas,
      ctx: ctx,
      score: score,
      launchSnoorp: this.launchSnoorp,
      snoorpSize: snoorpSize,
      cannon: this.cannon
    });
  }

  newSnoorp () {
    return new Snoorp({
      x: (gameCanvas.width / 2),
      y: gameCanvas.height,
      alive: true
    });
  }

  newCannon() {
    return new Cannon({
      ctx: ctx,
      numShots: numShots,
      launchSnoorp: this.launchSnoorp
    });
  }

  drawScore () {
    ctxScore.translate(100, 0);
    ctxScore.font = "60px sans-serif";
    ctxScore.textAlign = "center";
    ctxScore.fillText(this.board.getScore(), 0, 100);

    // draw header
    ctxScore.font = "40px sans-serif";
    ctxScore.fillText("score", 0, 40);
    ctxScore.translate(-100, 0);
  }

  gameOver (status) {
    if (status === 'won') {
      ctx.drawImage(winImage, 70, 150);
    } else {
      ctx.drawImage(lossImage, 20, 150);
    }
    ctx.drawImage(board, 220, 400, 300, 150);
    ctx.drawImage(playAgain, 250, 430);

    gameCanvas.addEventListener('click', this.resetGame.bind(this));
  }

  resetGame () {
    this.launchSnoorp = this.newSnoorp();
    this.cannon = this.newCannon();
    this.board = this.newBoard();
    const c = this.cannon;
    document.addEventListener("keydown", c.keyDownHandler.bind(c), false);
    document.addEventListener("keyup", c.keyUpHandler.bind(c), false);
  }

  run () {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctxScore.clearRect(0, 0, 200, 500);

    this.cannon.drawCannonRot();
    this.board.drawBoard();
    this.drawScore();

    // checkGameStatus returns null unless game is won or lost
    let status = this.board.checkGameStatus();
    if (status) { this.gameOver(status); }
  }

  play () {
    const c = this.cannon;
    document.addEventListener("keydown", c.keyDownHandler.bind(c), false);
    document.addEventListener("keyup", c.keyUpHandler.bind(c), false);
    setInterval(this.run.bind(this), 7);
  }
}

module.exports = Game;
