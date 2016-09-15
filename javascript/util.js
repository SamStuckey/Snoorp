class Util {
  adjustedForColVal (target) {
    var left, right;
    if (target.col % 2 === 0) {

      left = target.row;
      right = target.row + 1;
    } else {
      left = target.row - 1;
      right = target.row;
    }

    return {left: left, right: right};
  }

  findCluster(matchSnoorp, enemies) {
    return this.adjacentMatches(matchSnoorp, enemies);
  }

  adjacentMatches (matchSnoorp, enemies, existingMatches) {
    if (!existingMatches) {existingMatches = [matchSnoorp];}
    // find all touching snoorps of the same color
    var matches = this.adjacentSnoorps(matchSnoorp, enemies).filter((enemy) => {
      if (enemy.color === matchSnoorp.color) { return enemy; }
    });

    var newMatches = this.filterDoubles(matches, existingMatches);
    if (newMatches.length === 0) { return []; }

    // recusively check all new matches for their new matches and combine
    var allMatches = newMatches.concat(existingMatches);
    newMatches.forEach ((enemy) => {
      let newNewMatches = this.adjacentMatches(enemy, enemies, allMatches);
      allMatches = allMatches.concat(newNewMatches);
    });
    return allMatches;
  }

  adjacentSnoorps (matchSnoorp, enemies) {
    var targetCol = matchSnoorp.col;
    var targetRow = matchSnoorp.row;
    var lr = this.adjustedForColVal(matchSnoorp);
    var adjacent = [
          {col: targetCol - 1, row: lr.left},     // upper left
          {col: targetCol - 1, row: lr.right},    // upper right
          {col: targetCol + 1, row: lr.left},     // bottom left
          {col: targetCol + 1, row: lr.right},    // bottom right
          {col: targetCol, row: targetRow + 1},   // right
          {col: targetCol, row: targetRow - 1},   // left
        ];

    // return an array of snoorps in adjacent possitions
    const adjSnoorps = [];
    adjacent.forEach((pos) => {
      if (
      enemies[pos.col] &&
      enemies[pos.col][pos.row] &&
      enemies[pos.col][pos.row].alive
      ) {
        adjSnoorps.push(enemies[pos.col][pos.row]);
      }
    });

    return adjSnoorps;
  }

  convertToRads (deg) {
    return deg * Math.PI / 180;
  }

  filterDoubles (matches, existingMatches) {
    let newest =  matches.filter((newMatch) => {
      var repeat = false;
      existingMatches.forEach((oldMatch) => {
        if (newMatch === oldMatch) { repeat = true; }
      });

      if (!repeat) { return newMatch; }
    });
    return newest;
  }
}

module.exports = Util;
