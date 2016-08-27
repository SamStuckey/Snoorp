const Snoorp = require('./snoorp');
const Util = require('./util');

const enemyColumnCount = 2;
let initialized = false;

let util = new Util();

class Board {
  constructor (o) {
    this.canvas = o.canvas;
    this.ctx = o.ctx;
    this.launchSnoorp = o.launchSnoorp;
    this.score = o.score;
    this.enemyRowCount = (gameCanvas.width - o.snoorpSize) / (o.snoorpSize * 2);
    this.downShift = 0;
    this.enemies = [];
    this.snoorpSize = o.snoorpSize;
    this.cannon = o.cannon;

    this.addEnemies();
  }

  addEnemies () {
    for(let col = 0; col < enemyColumnCount; col++) {
      this.enemies[col] = [];
      for(let row = 0; row < this.enemyRowCount; row++) {
        var options = {alive: true, visible: true, col: col, row: row, enemies: this.enemies};
        this.enemies[col][row] = new Snoorp(options);
      }
    }
  }

  addLaunchSnoorpToEnemies (target) {
    const leftRightVals = util.adjustedForColVal(target);
    const newPos = this.getAttatchPosition(leftRightVals, target);
    this.launchSnoorp.col = newPos.col;
    this.launchSnoorp.row = newPos.row;

    if (this.enemies[newPos.col]) {
      this.enemies[newPos.col][newPos.row] = this.launchSnoorp;
    } else {
      this.putInNewRow();
    }
  }

  putInNewRow () {
    var newRow = [];
    for(let row = 0; row < this.enemyRowCount; row++) {
      if (row === this.launchSnoorp.row) {
        newRow.push(this.launchSnoorp);
      } else {
        newRow.push(new Snoorp({alive: false})); // blank sentinel
      }
    }
    this.enemies.push(newRow);
  }

  destroySnoorps () {
    const cluster = util.findCluster(this.launchSnoorp, this.enemies);
    cluster.push(this.launchSnoorp);

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
      this.findHangingSnoorps();
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
      this.resetLaunchSnoorp();
    } else if (      // collision with the ceiling
      (this.launchSnoorp.y - this.snoorpSize) + 1 <= (0 + this.downShift)
    ) {
      const row = Math.round(this.launchSnoorp.x / (this.snoorpSize * 2) - 1);
      this.enemies[0][row] = this.launchSnoorp;
      this.launchSnoorp.row = row;
      this.launchSnoorp.col = 0;
      this.resetLaunchSnoorp();
    }
  }

  drawBoard () {
    this.drawLaunchSnoorp();
    this.monitorEnemies();
  }

  drawEnemies (snoorp) {
    snoorp.x = (snoorp.row * (this.snoorpSize * 2)) + this.snoorpSize;
    snoorp.y = (snoorp.col * (this.snoorpSize * 2) + this.downShift) + this.snoorpSize;
    // create row offset
    if (snoorp.col % 2 === 0) { snoorp.x += 25; }

    //drop floating snoorp
    if (snoorp.falling) {
      if (snoorp.y < (this.canvas.height - 50)) {
        snoorp.vy += 15;
        snoorp.y += snoorp.vy;
      } else {
        snoorp.alive = false;
        snoorp.falling = false;
        snoorp.vy = 0;
      }
    }

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

  findHangingSnoorps () {
    var checked = [];
    this.enemies.forEach((row) => {
      row.forEach((snoorp) => {
        if (!checked.includes(snoorp)) {
          var cluster = this.getCluster(snoorp);
          var anchored = false;
          cluster.forEach((clustersnoorp) => {
            if (clustersnoorp.col === 0){
              anchored = true;
            }
          });

          if (!anchored) {
            cluster.forEach((snoorp) => {
              snoorp.falling = true;
              snoorp.color = '#000000';
            });

          }
        checked = checked.concat(cluster);
        }
      });
    });
  }

  getCluster(snoorp, included) {
    included = included || [snoorp];
    var adjSnoorps = util.adjacentSnoorps(snoorp, this.enemies);
    var newSnoorps = util.filterDoubles(adjSnoorps, included);
    if (newSnoorps.length === 0) { return included; }

    var allSnoorps = included.concat(newSnoorps);
    var newNewSnoorps = [];
    newSnoorps.forEach((newSnoorp) => {
      newNewSnoorps = newNewSnoorps.concat(this.getCluster(newSnoorp, allSnoorps));
    });
    return newNewSnoorps.concat(allSnoorps);
  }

  getScore () {
    return this.score;
  }

  isFreeFloating (snoorp, included) {
    if (!included) { included = []; }
    included.push(snoorp);

    var allsnoorpResponses = ['nope'];
    if (snoorp.col === 0) {
      allsnoorpResponses = ['anchored'];
    } else {
      var adjsnoorps = adjacentsnoorps(snoorp);
      var newsnoorps = filterDoubles(adjsnoorps, included);
      newsnoorps.forEach((adjsnoorp) => {
        allsnoorpResponses.concat(isFreeFloating(adjsnoorp, included));
      });
    }
    return allsnoorpResponses;
  }

  monitorEnemies () {
    for(let col = 0; col < this.enemies.length; col++) {
      for(let row = 0; row < this.enemyRowCount; row++) {
        const target = this.enemies[col][row];
        if (target.alive) {
          this.detectCollsion(target);
          this.drawEnemies(target);
        }
      }
    }
    initialized = true;
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
    this.launchSnoorp.launched = false;
    this.launchSnoorp.vx = 0;
    this.launchSnoorp.vy = 0;
    const newLaunchSnoorp = new Snoorp({
      x: (this.canvas.width / 2),
      y: this.canvas.height,
      alive: true
    });
    this.launchSnoorp = newLaunchSnoorp;
    this.cannon.resetLaunch(newLaunchSnoorp);
  }
}

module.exports = Board;
