const COLORS = ['#004FFA', '#00FA2E', '#FA00CC', '#FAAB00','#FAFA00'];
var launchsnoorpColor = randomColor();

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var gameCanvas = document.getElementById("gameCanvas");
var scoreCanvas = document.getElementById("scoreCanvas");
var ctxScore = scoreCanvas.getContext("2d");
var ctx = gameCanvas.getContext("2d");
var cannonHeight = 70;
var cannonWidth = 60;

 // upper left corner of cannon
var cannonX = (gameCanvas.width - cannonWidth) / 2;
var cannonY = (gameCanvas.height - cannonHeight);

var cannonAngle = 0;
var rightPressed = false;
var leftPressed = false;


var snoorpSize = 25;
var snoorpX = gameCanvas.width / 2;
var snoorpY = gameCanvas.height;
var snoorpVX = 0;
var snoorpVY = 0;
var snoorpSpeed = -800;
var launched = false;
var score = 0;
var downShift = 0;
var numberOfShots = 0;
var enemyColumnCount = 3;
var enemyRowCount = (gameCanvas.width - snoorpSize) / (snoorpSize * 2);
var enemyOffset = snoorpSize * 2;

var initialized = false;
var gameLost = false;
var gameWon = false;

var anchored = [];

function resetGame () {
  cannonAngle = 0;
  initialized = false;
  gameLost = false;
  gameWon = false;
  snoorpVX = 0;
  snoorpVY = 0;
  launched = false;
  score = 0;
  downShift = 0;
  numberOfShots = 0;
  enemies = [];
  createEnemies();
}

// Create enemies
var enemies = [];
function createEnemies() {
  for(var c=0; c<enemyColumnCount; c++) {
    enemies[c] = [];
    for(var r=0; r<enemyRowCount; r++) {
      var snoorp = { x: 0, y: 0, alive: true, color: null, col: c, row: r};
      enemies[c][r] = snoorp;
      anchored.push(snoorp);
    }
  }
}

createEnemies();

function pressDown () {
  downShift += snoorpSize * 2;
  numberOfShots = 0;
}

function animateDrop () {
  enemies.forEach((row) => {
    row.forEach((snoorp) => {
      if (snoorp.alive) {
      //   if (!anchored.includes(snoorp)) {
      //     snoorp.color = "#000000";
      //   }
      // }
        if (snoorp.y > gameCanvas.height) {
          snoorp.alive = false;
        }

        if (!snoorp.floating &&
          adjacentsnoorps(snoorp).length === 0) {
          enemies[snoorp.col][snoorp.row] = {
            x: 0, y: 0, alive: false, color: null, col: snoorp.col, row: snoorp.row, floating: false
          };
          snoorp.floating = true;
          snoorp.col = null;
          snoorp.row = null;
        }

        if (snoorp.floating) {
          snoorp.y += 10;
          // console.log(snoorp);
        }
      }
    });
  });
}

function addsnoorp (targetCol, targetRow, targetsnoorp) {
  var left, right;
  if (targetCol % 2 === 0) {
    left = targetRow;
    right = targetRow + 1;
  } else {
    left = targetRow - 1;
    right = targetRow;
  }

  var vertPos;
  if (snoorpY - targetsnoorp.y > 10) {
    vertPos = targetCol + 1;  // below
  } else if (snoorpY - targetsnoorp.y < 10 && snoorpY - targetsnoorp.y > -10) {
    vertPos = targetCol;      // on the same level
    left = targetRow - 1;
    right = targetRow + 1;
  } else {
    vertPos = targetCol - 1;  // above
  }

  var horzPos = snoorpX - targetsnoorp.x > 0 ? right : left;
  if (!enemies[vertPos]) {
    createDummyRowWith(vertPos, horzPos);
  } else {
    enemies[vertPos][horzPos] = {
      x: 0,
      y: 0,
      alive: true,
      color: launchsnoorpColor,
      col: vertPos,
      row: horzPos
    };
  }

  var launchsnoorp = enemies[vertPos][horzPos];
  var matches = adjacentMatches(launchsnoorp);
  if (matches.length > 2) {
    destroysnoorps(matches);
  }
}

function adjacentMatches (matchsnoorp, existingMatches) {
  if (!existingMatches) {existingMatches = [];}

  // find all touching snoorps of the same color
  var matches = adjacentsnoorps(matchsnoorp).filter((snoorp) => {
    if (snoorp.color === matchsnoorp.color) {
      return snoorp;
    }
  });

  var newMatches = filterDoubles(matches, existingMatches);
  // if there are no new matches, return back through the stack
  if (newMatches.length === 0) {
    return [];
  }

  // recusively check all new matches for their new matches and combine
  var allMatches = newMatches.concat(existingMatches);
  newMatches.forEach ((snoorp) => {
    newMatches = newMatches.concat(
      adjacentMatches(snoorp, allMatches)
    );
  });

  return newMatches;
}

function adjacentsnoorps(snoorp) {
  var targetCol = snoorp.col;
  var targetRow = snoorp.row;
  var adjustedAdjacent;
  if (targetCol % 2 !== 0) {
    adjustedAdjacent = [
      {col: targetCol - 1, row: targetRow - 1},     // upper left
      {col: targetCol + 1, row: targetRow - 1},     // bottom left
    ];
  } else {
    adjustedAdjacent = [
      {col: targetCol - 1, row: targetRow + 1},     // upper right
      {col: targetCol + 1, row: targetRow + 1}      // bottom right
    ];
  }

  var alwaysAdjacent = [
    {col: targetCol, row: targetRow + 1},         // right
    {col: targetCol, row: targetRow - 1},         // left
    {col: targetCol - 1, row: targetRow},         // above
    {col: targetCol + 1, row: targetRow},         // below
  ];

  var adjacentPositions = alwaysAdjacent.concat(adjustedAdjacent);
  var snoorps = adjacentPositions.map((pos) => {
    if (enemies[pos.col] &&
      enemies[pos.col][pos.row] &&
      enemies[pos.col][pos.row].alive) {
      return enemies[pos.col][pos.row];
    }
  });

  return snoorps.filter((snoorp) => {
    if (snoorp) {return snoorp;}
  });
}

function baselineCollisionDetection () {
  if ((snoorpY - snoorpSize) +1 <= 0 + downShift) {
    var row = Math.round(snoorpX / (snoorpSize * 2) - 1);
    enemies[0][row] = {
      x: 0,
      y: 0,
      color: launchsnoorpColor,
      alive: true,
      col: 0,
      row: row
    };
    resetLaunchsnoorp();
  }
}

function collisionDetection () {
  gameWon = true;

  for(var col = 0; col < enemies.length; col++) {
    for(var row = 0; row < enemyRowCount; row++) {
      var target = enemies[col][row];

      if (target.y + snoorpSize > gameCanvas.height - 100) {
        gameLost = true;
      }

      if(target.alive) {
        gameWon = false;
        if(snoorpX + snoorpSize > target.x - snoorpSize &&
          snoorpX - snoorpSize < target.x + snoorpSize &&
          snoorpY + snoorpSize > target.y - snoorpSize &&
          snoorpY - snoorpSize < target.y + snoorpSize) {

          addsnoorp(col, row, target);
          resetLaunchsnoorp();
          return;
        }
      }
    }
  }
}

function destroysnoorps(snoorpsToDelete) {
  var count = 0;
  var multiplier = 0;
  snoorpsToDelete.forEach((snoorp) => {
    snoorp.alive = false;
    snoorp.color = null;
    count += 1;
    multiplier += 1;
  });

  // adds 10 points per snoorp, multiles by 2 for each additional snoorp
  score = score + ((count * 10) * 2);
  dropHangingsnoorps();
}

function createDummyRowWith(colPos, rowPos) {
  var row = [];
  for(var r=0; r<enemyRowCount; r++) {
    if (r === rowPos) {
      row.push({
        x: 0,
        y: 0,
        alive: true,
        color: launchsnoorpColor,
        col: colPos,
        row: rowPos,
      }); // new live snoorp
    } else {
      row.push({
        x: 0,
        y: 0,
        alive: false,
        color: null,
        col: colPos,
        row: rowPos,
      }); // blank sentinel
    }
  }
  enemies.push(row);
}

function checkGameOver () {
  if (gameWon) {
    alert("You Win!!!!");
    resetGame();
  } else if (gameLost) {
    alert("You lose...");
    resetGame();
  }
}

function convertToRads(deg) {
  return deg * Math.PI / 180;
}

function draw() {
  // limit cannon movement
  ctx.clearRect(0,0, gameCanvas.width, gameCanvas.height);
  ctxScore.clearRect(0,0, 200, 500);
  if (rightPressed) {
    if (cannonAngle < 70) {
      cannonAngle += 1;
    }
  } else if (leftPressed) {
    if (cannonAngle > -70) {
      cannonAngle -= 1;
    }
  }

  if (snoorpX - snoorpSize <= 0 || snoorpX + snoorpSize >= gameCanvas.width) {
    snoorpVX = snoorpVX * (-1);
  }

  drawEnemies();
  drawCannonRot();
  drawCannonBase();
  drawLaunchsnoorp();
  collisionDetection();
  baselineCollisionDetection();
  // animateDrop();
  drawScore();
  drawScoreLabels();
  // checkGameOver();
}

function drawCannon () {
  ctx.beginPath();
  ctx.rect(cannonX, cannonY, cannonWidth, cannonHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawCannonBase () {
  ctx.beginPath();
  ctx.arc(gameCanvas.width / 2, gameCanvas.height, 50, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawCannonRot() {
  var rad = convertToRads(cannonAngle);
  // find the pivot point
  var cannonCenter = gameCanvas.width / 2;
  var cannonBase = gameCanvas.height;
  // adjust for gameCanvas translation to put cannon back on the page
  cannonX = -cannonWidth / 2;
  cannonY = -cannonHeight;
  // set ctx to the bottom middle of the cannon
  ctx.translate(cannonCenter, cannonBase);
  //rotate the gameCanvas
  ctx.rotate(rad);

  drawCannon();
  // reset the gameCanvas
  ctx.rotate(-rad);
  ctx.translate(-cannonCenter, -cannonBase);
}

function drawLaunchsnoorp() {
  snoorpX += snoorpVX;
  snoorpY += snoorpVY;

  ctx.beginPath();
  ctx.arc(snoorpX, snoorpY, snoorpSize, 0, Math.PI*2);
  ctx.fillStyle = launchsnoorpColor;
  ctx.fill();
  ctx.closePath();
}

function drawEnemies() {
  for(var c=0; c<enemies.length; c++) {
    for(var r=0; r<enemyRowCount; r++) {
      var snoorp = enemies[c][r];
      if(snoorp.alive) {
        if (!initialized) {
          snoorp.color = randomColor(snoorp.x, snoorp.y);
        }
        snoorp.x = (r*(snoorpSize * 2)) + snoorpSize;
        snoorp.y = (c*(snoorpSize * 2) + downShift) + snoorpSize;
        if (c % 2 === 0) { snoorp.x += 25; }

        ctx.beginPath();
        ctx.arc(snoorp.x, snoorp.y, snoorpSize, 0, Math.PI*2);
        ctx.fillStyle = snoorp.color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
  initialized = true;
}

function drawScore () {
  ctxScore.translate(100, 0);
  ctxScore.font = "60px sans-serif";
  ctxScore.textAlign = "center";
  ctxScore.fillText(score, 0, 100);
  ctxScore.translate(-100, 0);
}

function drawScoreLabels () {
  ctxScore.translate(100, 0);
  ctxScore.font = "40px comic-sans";
  ctxScore.textAlign = "center";
  ctxScore.fillText("score", 0, 40);
//   ctxScore.translate(-100, 0);
}

function dropHangingsnoorps () {
  var checked = [];
  enemies.forEach((row) => {
    row.forEach((snoorp) => {
      if (!checked.includes(snoorp)) {
        var cluster = getCluster(snoorp);
        var anchored = cluster.some((clustersnoorp) => {
          return clustersnoorp.col === 0;
        });

        if (!anchored) {
          cluster.forEach((snoorp) => snoorp.color = "#000000");
        }
      checked = checked.concat(cluster);
    }
  });
  // anchored = [];
  // enemies[0].forEach((basesnoorp) => {
  //   // debugger
  //   if (!anchored.includes(basesnoorp)) {
  //     anchored.concat(getCluster(basesnoorp));
  //   }
  // });
  });
}

function getCluster(snoorp, included) {
  included = included || [];
  var adjsnoorps = adjacentsnoorps(snoorp);
  var newsnoorps = filterDoubles(adjsnoorps, included);
  if (newsnoorps.length === 0) { return included; }
  included = included.concat(newsnoorps);

  var allsnoorps = [];
  newsnoorps.forEach((newsnoorp) => {
    allsnoorps = allsnoorps.concat(getCluster(newsnoorp, included));
  });
  return allsnoorps;
}


function isFreeFloating (snoorp, included) {
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
      // if (!allsnoorpResponses) { return false; }
    });
  }
  return allsnoorpResponses;
}



function keyDownHandler (e) {
  if(e.keyCode == 39) { // right arrow
    rightPressed = true;
  }
  else if(e.keyCode == 37) { // left arrow
    leftPressed = true;
  } else if(e.keyCode == 32) { // spacebar launcher
    fireSnoorp();
  }
}

function filterDoubles (matches, existingMatches) {
  return matches.filter((newMatch) => {
    var repeat;
    existingMatches.forEach((oldMatch) => {
      if (oldMatch.col === newMatch.col && oldMatch.row === newMatch.row) {
        repeat = true;
      }
    });

    if (!repeat) { return newMatch; }
  });
}

function keyUpHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = false;
  }
  else if(e.keyCode == 37) {
    leftPressed = false;
  }
}

function randomColor () {
  return COLORS[(Math.floor(Math.random() * COLORS.length))];
}

function resetLaunchsnoorp() {
  snoorpVX = 0;
  snoorpVY = 0;
  snoorpX = gameCanvas.width / 2;
  snoorpY = gameCanvas.height;
  launched = false;
  launchsnoorpColor = randomColor();
  if (numberOfShots === 10) {
    pressDown();
  }
}

setInterval(draw, 10);
