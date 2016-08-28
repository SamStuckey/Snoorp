const Cannon = require('./cannon');
const Board = require('./board');
const Snoorp = require('./snoorp');


const gameCanvas = document.getElementById("gameCanvas");
const scoreCanvas = document.getElementById("scoreCanvas");
const resetButton = document.getElementById('reset');

const ctx = gameCanvas.getContext("2d");
const ctxScore = scoreCanvas.getContext("2d");
const snoorpSize = 25;

const winImage = new Image();
winImage.src = "./images/win_text.png";

const lossImage = new Image();
lossImage.src = "./images/loss_text.png";

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
      ctx.drawImage(lossImage, 50, 150);
    }
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText('click to play again', 290, 420);
  }

  resetGame () {
    this.launchSnoorp = this.newSnoorp();
    this.cannon = this.newCannon();
    this.board = this.newBoard();
  }

  run () {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctxScore.clearRect(0, 0, 200, 500);

    this.cannon.drawCannonRot();
    this.board.drawBoard();
    this.drawScore();
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
