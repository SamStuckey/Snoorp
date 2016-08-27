const COLORS = ['#004FFA', '#00FA2E', '#FA00CC', '#FAAB00','#FAFA00'];
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
    this.board = o.board;
  }

  adjacentMatches (snoorp, existingMatches) {
    snoorp = snoorp || this;
    // debugger
    if (!existingMatches) {existingMatches = [];}
    // find all touching snoorps of the same color
    var matches = this.adjacentSnoorps(snoorp).filter((snoorp) => {
      if (snoorp.color === matchsnoorp.color) { return snoorp; }
    });

    var newMatches = filterDoubles(matches, existingMatches);
    if (newMatches.length === 0) { return []; }

    // recusively check all new matches for their new matches and combine
    var allMatches = newMatches.concat(existingMatches);
    newMatches.forEach ((snoorp) => {
      newMatches = newMatches.concat(adjacentMatches(snoorp, allMatches));
    });

    return newMatches;
  }

  adjacentSnoorps (snoorp) {
    var targetCol = this.col;
    var targetRow = this.row;
    var lr = util.adjustedForColVal(snoorp);
    var adjacent = [
          {col: targetCol - 1, row: lr.left},     // upper left
          {col: targetCol - 1, row: lr.right},    // upper right
          {col: targetCol + 1, row: lr.left},     // bottom left
          {col: targetCol + 1, row: lr.right},    // bottom right
          {col: targetCol, row: targetRow + 1},   // right
          {col: targetCol, row: targetRow - 1},   // left
          {col: targetCol - 1, row: targetRow},   // above
          {col: targetCol + 1, row: targetRow},   // below
        ];

    // return an array of snoorps in adjacent possitions
    return adjacent.filter((pos) => {
      const enemies = this.enemies;
      if (
      enemies[pos.col] &&
      enemies[pos.col][pos.row] &&
      enemies[pos.col][pos.row].alive
      ) {
        return this.board.enemies[pos.col][pos.row];
      }
    });
  }

  filterDoubles (matches, existingMatches) {
    return matches.filter((newMatch) => {
      var repeat;
      existingMatches.forEach((oldMatch) => {
        if (newMatch === oldMatch) { repeat = true; }
      });

      if (!repeat) { return newMatch; }
    });
  }

  randomColor () {
    return COLORS[(Math.floor(Math.random() * COLORS.length))];
  }
}

module.exports = Snoorp;
