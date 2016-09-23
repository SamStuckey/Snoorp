
# Snoorp

Snoorp is a game based off of the browser classic 'Snood'.  Built using Javascript and HTML5 canvas.

## The Rules

1. Shoot the snoorps at other snoorps of the same color.  A set of 3 or more will disapear and score points.
2. You get 10 points for every snoorp you destroy.  For every snoorp in a cluster you get a bonus multiplier of x2 to that shot's score.
3. Destroy all the snoorps before they reach the bottom of the screen!

## Technical Details

Snoorp was created using Javascript, HTML5 Canvas, and CSS.

### Piece destruction and monitoring

#### Monitoring

The game board is updated every 7 milliseconds.  Everytime the board updates a nested loop runs to draw and monitor each pieces game state.
```js
monitorEnemies () {
  this.gameStatus = "won";
  for(let col = 0; col < this.enemies.length; col++) {
    for(let row = 0; row < this.enemyRowCount; row++) {
      const target = this.enemies[col][row];
      if (target.alive) {
        // check if game is over
        if (!target.falling && target.y > this.canvas.height - 100) {
          this.gameStatus = "lost";
        } else {
          this.gameStatus = null;
        }

        if (!this.anchored.includes(target)) { target.falling = true; }
        this.drawEnemy(target);
        this.detectCollsion(target);
      }
    }
  }
  this.initialized = true;
}
```

#### Collision

Collision is detected by comparing the x and y coordinates of each piece to the 'launchSnoorp'.
if a collision is detected a recursive depth first search will be run to return a cluster of matching colored snoorps.  This DFS
uses memoization to avoid infinite looping.

```js
getCluster(snoorp, included) {
  included = included || [snoorp];
  var adjSnoorps = util.adjacentSnoorps(snoorp, this.enemies);
  var newSnoorps = util.filterDoubles(adjSnoorps, included);
  if (newSnoorps.length === 0) { return []; }

  var allSnoorps = included.concat(newSnoorps);
  newSnoorps.forEach((newSnoorp) => {
    let newNewSnoorps = this.getCluster(newSnoorp, allSnoorps);
    allSnoorps = allSnoorps.concat(newNewSnoorps);
  });
  return allSnoorps;
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
```

Once no more matching snoorps are returned, all the snoorps in the cluster will be destroyed.

#### Dropping floaters

After a collision there may be free floating snoorps that were not destroyed because they were not a color match,
however they are no longer rooted to the ceiling of the board and need to be dropped.  To accomplish this another DFS is run, starting in the upper left corner of the board.  This creates a log of all anchored snoorps.  Each snoorp is then compared to the log of anchored snoorps and if they are not anchored then they are set to 'falling'.  This will accelerate their y value until they disappear and are removed from play.

```js

updateAnchored () {
  let newAnchored = [];
  this.enemies[0].forEach((anchor) => {
    if (anchor.alive && !newAnchored.includes(anchor)) {
      newAnchored.push(anchor);
      newAnchored = newAnchored.concat(this.getCluster(anchor));
    }
  });
  this.anchored = newAnchored;
}

getCluster(snoorp, included) {
  included = included || [snoorp];
  var adjSnoorps = util.adjacentSnoorps(snoorp, this.enemies);
  var newSnoorps = util.filterDoubles(adjSnoorps, included);
  if (newSnoorps.length === 0) { return []; }

  var allSnoorps = included.concat(newSnoorps);
  newSnoorps.forEach((newSnoorp) => {
    let newNewSnoorps = this.getCluster(newSnoorp, allSnoorps);
    allSnoorps = allSnoorps.concat(newNewSnoorps);
  });
  return allSnoorps;
}
```

### Cannon and launchSnoorp

The cannon is controlled by the arrow keys and spacebar.  Every time it is moved it's new angle is saved inside of an instance variable.  
When the cannon fires that angle is interpreted into velocity using a preset launch speed.
```js
fireSnoorp () {
  const rad = util.convertToRads(this.angle + 90);
  this.launched = true;
  this.launchSnoorp.launched = true;
  this.launchSnoorp.vx = Math.cos(rad)*launchSpeed/60;
  this.launchSnoorp.vy = Math.sin(rad)*launchSpeed/60;
}
```
