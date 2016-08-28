const COLORS = ['#004FFA','#00FA2E'];//, '#FA00CC', '#FAAB00','#FAFA00'];
const Util = require('./util');

const util = new Util();

class Snoorp {
  constructor (o = {}) {
    this.x = o.x || 0;
    this.y = o.y || 0;
    this.alive = o.alive;
    this.color = this.randomColor();
    this.col = o.col;
    this.row = o.row;
    this.falling = false;
    this.vx = 0;
    this.vy = 0;
    this.launched = false;
  }

  randomColor () {
    return COLORS[(Math.floor(Math.random() * COLORS.length))];
  }
}

module.exports = Snoorp;
