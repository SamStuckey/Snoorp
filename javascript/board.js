const Snoorp = require('./snoorp');

const enemyColumnCount = 4;
let initialized = false;

class Board {
  constructor (o) {
    this.canvas = o.canvas;
    this.ctx = o.ctx;
    this.launchSnoorp = o.launchSnoorp;
    this.score = o.score;
    this.enemyRowCount = (gameCanvas.width - o.snoorpSize) / (o.snoorpSize * 2);
    this.enemies = [];
    this.downShift = 0;
    this.snoorpSize = o.snoorpSize;

    this.addEnemies();
  }

  addEnemies () {
    for(let col = 0; col < enemyColumnCount; col++) {
      this.enemies[col] = [];
      for(let row = 0; row < this.enemyRowCount; row++) {
        var options = {alive: true, visible: true, col: col, row: row};
        this.enemies[col][row] = new Snoorp(options);
      }
    }
  }

    addLaunchSnoorpToEnemies (target) {
    const LeftRightVals = this.adjustedForColVal(target);
    const newPos = this.getAttatchPosition(LeftRightVals, target);
    this.launchSnoorp.col = newPos.col;
    this.launchSnoorp.row = newPos.row;

    if (this.board.enemies()[newPos.col]) {
      this.board.enemies()[newPos.col][newPos.row] = this.launchSnoorp;
    } else {
      this.putInNewRow();
    }
  }

  putInNewRow () {
    var newRow = [];
    for(let r = 0; r < this.enemyRowCount; r++) {
      if (r === this.launchSnoorp.rowPos) {
        row.push(this.launchSnoorp);
      } else {
        row.push(new Snoorp({alive: false})); // blank sentinel
      }
    }
    enemies.push(row);
  }

  destroySnoorps () {
    const cluster = this.launchSnoorp.adjacentMatches();

    if (cluster.length > 2) {
      let count = 0;
      let multiplier = 0;

      cluster.forEach((snoorp) => {
        snoorp.alive = false;
        snoorp.color = null;
        count += 1;
        multiplier += 1;
      });
      // adds 10 points per snoorp, multiles by 2 for each additional snoorp
      this.score += ((count * 10) * 2);
      this.dropHangingSnoorps();
    }
  }

    detectCollsion (target) {
    if (              // collision with other snoorp
      this.launchSnoorp.x + this.snoorpSize > target.x - this.snoorpSize &&
      this.launchSnoorp.x - this.snoorpSize < target.x + this.snoorpSize &&
      this.launchSnoorp.y + this.snoorpSize > target.y - this.snoorpSize &&
      this.launchSnoorp.y - this.snoorpSize < target.y + this.snoorpSize
    ) {
      this.addLaunchSnoorpToEnemies(target);
      this.destroySnoorps();
    } else if (      // collision with the ceiling
      (this.launchSnoorp.y - this.snoorpSize) + 1 <= (0 + this.downShift)
    ) {
      const row = Math.round(this.launchSnoorp.x / (this.snoorpSize * 2) - 1);
      enemies[0][row] = this.launchSnoorp;
    }
    this.resetLaunchSnoorp();
  }

  drawBoard () {
    this.drawLaunchSnoorp();
    this.monitorEnemies();
  }

  drawEnemy (snoorp) {
    snoorp.x = snoorp.x || (snoorp.row * (this.snoorpSize * 2)) + this.snoorpSize;
    snoorp.y = (snoorp.col * (this.snoorpSize * 2) + this.downShift) + this.snoorpSize;
    // create row offset
    if (snoorp.col % 2 === 0 && !initialized) { snoorp.x += 25; }

    this.drawSnoorp(snoorp);
  }

  drawLaunchSnoorp () {
    const snoorp = this.launchSnoorp;

    // bounce off the wall
    const touchingLeft = snoorp.x - this.snoorpSize <= 0;
    const touchingRight = snoorp.x + this.snoorpSize >= this.canvas.width;
    if (touchingLeft || touchingRight) { snoorp.vx *= -1; }

    snoorp.x += snoorp.vx;
    snoorp.y += snoorp.vy;

    this.drawSnoorp(snoorp);
  }

  drawSnoorp (snoorp) {
    this.ctx.beginPath();
    this.ctx.arc(snoorp.x, snoorp.y, this.snoorpSize, 0, Math.PI*2);
    this.ctx.fillStyle = snoorp.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  monitorEnemies () {
    for(let col = 0; col < this.enemies.length; col++) {
      for(let row = 0; row < this.enemyRowCount; row++) {
        const target = this.enemies[col][row];
        if (target.alive) {
          this.detectCollsion(target);
          this.drawEnemy(target);
          if (target.falling) { this.moveFallingSnoorps(target); }
        }
      }
    }
    initialized = true;
  }

    moveFallingSnoorps (snoorp) {
    if (snoorp.y < this.canvas.height) {
      snoorp.y *= 1.2;
    } else {
      snoorp.alive = false;
      snoorp.falling = false;
    }
  }

    getAttatchPosition (lr, target) {
    let col, row;
    if (this.launchSnoorp.y - target.y > 10) {
      col = target.col + 1;  // below
    } else if (this.launchSnoorp.y - target.y < 10 &&
               this.launchSnoorp.y - target.y > -10) {
      col = target.col;      // on the same level
    } else {
      col = target.col - 1;  // above
    }

    row = this.launchSnoorp.x - target.x > 0 ? lr.right : lr.left;

    return {col: col, row: row};
  }

  pressDown () {
    this.downShift += this.snoorpSize * 2;
  }

  resetLaunchSnoorp () {
    this.launchSnoorp = new Snoorp({
      x: (this.canvas.width / 2),
      y: this.canvas.height,
      alive: true
    });
  }
}

module.exports = Board;
