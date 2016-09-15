const Util = require('./util');

const green = new Image();
green.src = "images/green.png";

const blue = new Image();
blue.src = "images/blue.png";

const pink = new Image();
pink.src = "images/pink.png";

const orange = new Image();
orange.src = "images/orange.png";

const COLORS = [green, blue];//, pink, orange];
const util = new Util();

class Snoorp {
  constructor (o = {}) {
    this.x = o.x || 0;
    this.y = o.y || 0;
    this.alive = o.alive;
    this.col = o.col;
    this.row = o.row;
    this.falling = false;
    this.vx = 0;
    this.vy = 0;
    this.launched = false;
    this.possibleColors = o.remainingColors || COLORS;
    this.color = this.randomColor();
  }

  randomColor () {
    let c = this.possibleColors;
    return c[(Math.floor(Math.random() * c.length))];
  }
}

module.exports = Snoorp;
