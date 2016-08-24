const Cannon = require('./cannon');
const Board = require('./board');
const Snoorp = require('./snoorp');


const gameCanvas = document.getElementById("gameCanvas");
const scoreCanvas = document.getElementById("scoreCanvas");
const ctx = gameCanvas.getContext("2d");
const ctxScore = scoreCanvas.getContext("2d");
const snoorpSize = 25;

let score = 0;
let numShots = 0;
class Game {
  constructor () {
    this.launchSnoorp = this.newSnoorp();
    this.cannon = this.newCannon();
    this.board = this.newBoard();
  }

  newBoard () {
    return new Board({
      canvas: gameCanvas,
      ctx: ctx,
      score: score,
      launchSnoorp: this.launchSnoorp,
      snoorpSize: snoorpSize
    });
  }

  newSnoorp () {
    return new Snoorp({
      x: (gameCanvas.width / 2),
      y: gameCanvas.height,
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
    ctxScore.fillText(score, 0, 100);

    // draw header
    ctxScore.font = "40px sans-serif";
    ctxScore.fillText("score", 0, 40);
    ctxScore.translate(-100, 0);
  }

  run () {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctxScore.clearRect(0, 0, 200, 500);

    this.cannon.drawCannonRot();
    this.board.drawBoard();
    this.drawScore();
    // checkGameOver();
  }

  play () {
    document.addEventListener("keydown", this.cannon.keyDownHandler, false);
    document.addEventListener("keyup", this.cannon.keyUpHandler, false);
    setInterval(this.run.bind(this), 10);
  }
}

module.exports = Game;
