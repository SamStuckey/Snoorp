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
}

module.exports = Util;
