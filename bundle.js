/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Cannon = __webpack_require__(1);
	
	var COLORS = ['#004FFA', '#00FA2E']; //, '#FA00CC', '#FAAB00','#FAFA00'];
	var launchSnoodColor = randomColor();
	
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
	var cannonY = gameCanvas.height - cannonHeight;
	
	var cannonAngle = 0;
	var rightPressed = false;
	var leftPressed = false;
	
	var snoodSize = 25;
	var snoodX = gameCanvas.width / 2;
	var snoodY = gameCanvas.height;
	var snoodVX = 0;
	var snoodVY = 0;
	var snoodSpeed = -800;
	var launched = false;
	var score = 0;
	var downShift = 0;
	var numberOfShots = 0;
	var enemyColumnCount = 3;
	var enemyRowCount = (gameCanvas.width - snoodSize) / (snoodSize * 2);
	var enemyOffset = snoodSize * 2;
	
	var initialized = false;
	var gameLost = false;
	var gameWon = false;
	
	var anchored = [];
	
	function resetGame() {
	  cannonAngle = 0;
	  initialized = false;
	  gameLost = false;
	  gameWon = false;
	  snoodVX = 0;
	  snoodVY = 0;
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
	  for (var c = 0; c < enemyColumnCount; c++) {
	    enemies[c] = [];
	    for (var r = 0; r < enemyRowCount; r++) {
	      var snood = { x: 0, y: 0, alive: true, color: null, col: c, row: r };
	      enemies[c][r] = snood;
	      anchored.push(snood);
	    }
	  }
	}
	
	createEnemies();
	
	function pressDown() {
	  downShift += snoodSize * 2;
	  numberOfShots = 0;
	}
	
	function animateDrop() {
	  enemies.forEach(function (row) {
	    row.forEach(function (snood) {
	      if (snood.alive) {
	        if (!anchored.includes(snood)) {
	          snood.color = "#000000";
	        }
	      }
	      //       if (snood.y > gameCanvas.height) {
	      //         snood.alive = false;
	      //       }
	      //
	      //       if (!snood.floating &&
	      //
	      //         adjacentSnoods(snood).length === 0) {
	      //         enemies[snood.col][snood.row] = {
	      //           x: 0, y: 0, alive: false, color: null, col: snood.col, row: snood.row, floating: false
	      //         };
	      //         snood.floating = true;
	      //         snood.col = null;
	      //         snood.row = null;
	      //       }
	      //
	      //       if (snood.floating) {
	      //         snood.y += 10;
	      //         // console.log(snood);
	      //       }
	      //     }
	    });
	  });
	}
	
	function addSnood(targetCol, targetRow, targetSnood) {
	  var left, right;
	  if (targetCol % 2 === 0) {
	    left = targetRow;
	    right = targetRow + 1;
	  } else {
	    left = targetRow - 1;
	    right = targetRow;
	  }
	
	  var vertPos;
	  if (snoodY - targetSnood.y > 10) {
	    vertPos = targetCol + 1; // below
	  } else if (snoodY - targetSnood.y < 10 && snoodY - targetSnood.y > -10) {
	    vertPos = targetCol; // on the same level
	    left = targetRow - 1;
	    right = targetRow + 1;
	  } else {
	    vertPos = targetCol - 1; // above
	  }
	
	  var horzPos = snoodX - targetSnood.x > 0 ? right : left;
	  if (!enemies[vertPos]) {
	    createDummyRowWith(vertPos, horzPos);
	  } else {
	    enemies[vertPos][horzPos] = {
	      x: 0,
	      y: 0,
	      alive: true,
	      color: launchSnoodColor,
	      col: vertPos,
	      row: horzPos
	    };
	  }
	
	  var launchSnood = enemies[vertPos][horzPos];
	  var matches = adjacentMatches(launchSnood);
	  if (matches.length > 2) {
	    destroySnoods(matches);
	  }
	}
	
	function adjacentMatches(matchSnood, existingMatches) {
	  if (!existingMatches) {
	    existingMatches = [];
	  }
	
	  // find all touching snoods of the same color
	  var matches = adjacentSnoods(matchSnood).filter(function (snood) {
	    if (snood.color === matchSnood.color) {
	      return snood;
	    }
	  });
	
	  var newMatches = filterDoubles(matches, existingMatches);
	  // if there are no new matches, return back through the stack
	  if (newMatches.length === 0) {
	    return [];
	  }
	
	  // recusively check all new matches for their new matches and combine
	  var allMatches = newMatches.concat(existingMatches);
	  newMatches.forEach(function (snood) {
	    newMatches = newMatches.concat(adjacentMatches(snood, allMatches));
	  });
	
	  return newMatches;
	}
	
	function adjacentSnoods(snood) {
	  var targetCol = snood.col;
	  var targetRow = snood.row;
	  var adjustedAdjacent;
	  if (targetCol % 2 !== 0) {
	    adjustedAdjacent = [{ col: targetCol - 1, row: targetRow - 1 }, // upper left
	    { col: targetCol + 1, row: targetRow - 1 }];
	  } else {
	    adjustedAdjacent = [{ col: targetCol - 1, row: targetRow + 1 }, // upper right
	    { col: targetCol + 1, row: targetRow + 1 } // bottom right
	    ];
	  }
	
	  var alwaysAdjacent = [{ col: targetCol, row: targetRow + 1 }, // right
	  { col: targetCol, row: targetRow - 1 }, // left
	  { col: targetCol - 1, row: targetRow }, // above
	  { col: targetCol + 1, row: targetRow }];
	
	  var adjacentPositions = alwaysAdjacent.concat(adjustedAdjacent);
	  var snoods = adjacentPositions.map(function (pos) {
	    if (enemies[pos.col] && enemies[pos.col][pos.row] && enemies[pos.col][pos.row].alive) {
	      return enemies[pos.col][pos.row];
	    }
	  });
	
	  return snoods.filter(function (snood) {
	    if (snood) {
	      return snood;
	    }
	  });
	}
	
	function baselineCollisionDetection() {
	  if (snoodY - snoodSize + 1 <= 0 + downShift) {
	    var row = Math.round(snoodX / (snoodSize * 2) - 1);
	    enemies[0][row] = {
	      x: 0,
	      y: 0,
	      color: launchSnoodColor,
	      alive: true,
	      col: 0,
	      row: row
	    };
	    resetLaunchSnood();
	  }
	}
	
	function collisionDetection() {
	  gameWon = true;
	
	  for (var col = 0; col < enemies.length; col++) {
	    for (var row = 0; row < enemyRowCount; row++) {
	      var target = enemies[col][row];
	
	      if (target.y + snoodSize > gameCanvas.height - 100) {
	        gameLost = true;
	      }
	
	      if (target.alive) {
	        gameWon = false;
	        if (snoodX + snoodSize > target.x - snoodSize && snoodX - snoodSize < target.x + snoodSize && snoodY + snoodSize > target.y - snoodSize && snoodY - snoodSize < target.y + snoodSize) {
	
	          addSnood(col, row, target);
	          resetLaunchSnood();
	          return;
	        }
	      }
	    }
	  }
	}
	
	function destroySnoods(snoodsToDelete) {
	  var count = 0;
	  var multiplier = 0;
	  snoodsToDelete.forEach(function (snood) {
	    snood.alive = false;
	    snood.color = null;
	    count += 1;
	    multiplier += 1;
	  });
	
	  // adds 10 points per snood, multiles by 2 for each additional snood
	  score = score + count * 10 * 2;
	  dropHangingSnoods();
	}
	
	function createDummyRowWith(colPos, rowPos) {
	  var row = [];
	  for (var r = 0; r < enemyRowCount; r++) {
	    if (r === rowPos) {
	      row.push({
	        x: 0,
	        y: 0,
	        alive: true,
	        color: launchSnoodColor,
	        col: colPos,
	        row: rowPos
	      }); // new live snood
	    } else {
	      row.push({
	        x: 0,
	        y: 0,
	        alive: false,
	        color: null,
	        col: colPos,
	        row: rowPos
	      }); // blank sentinel
	    }
	  }
	  enemies.push(row);
	}
	
	function checkGameOver() {
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
	  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	  ctxScore.clearRect(0, 0, 200, 500);
	  if (rightPressed) {
	    if (cannonAngle < 70) {
	      cannonAngle += 1;
	    }
	  } else if (leftPressed) {
	    if (cannonAngle > -70) {
	      cannonAngle -= 1;
	    }
	  }
	
	  if (snoodX - snoodSize <= 0 || snoodX + snoodSize >= gameCanvas.width) {
	    snoodVX = snoodVX * -1;
	  }
	
	  drawEnemies();
	  drawCannonRot();
	  drawCannonBase();
	  drawLaunchSnood();
	  collisionDetection();
	  baselineCollisionDetection();
	  // animateDrop();
	  drawScore();
	  drawScoreLabels();
	  // checkGameOver();
	}
	
	function drawCannon() {
	  ctx.beginPath();
	  ctx.rect(cannonX, cannonY, cannonWidth, cannonHeight);
	  ctx.fillStyle = "#0095DD";
	  ctx.fill();
	  ctx.closePath();
	}
	
	function drawCannonBase() {
	  ctx.beginPath();
	  ctx.arc(gameCanvas.width / 2, gameCanvas.height, 50, 0, Math.PI * 2);
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
	
	function drawLaunchSnood() {
	  snoodX += snoodVX;
	  snoodY += snoodVY;
	
	  ctx.beginPath();
	  ctx.arc(snoodX, snoodY, snoodSize, 0, Math.PI * 2);
	  ctx.fillStyle = launchSnoodColor;
	  ctx.fill();
	  ctx.closePath();
	}
	
	function drawEnemies() {
	  for (var c = 0; c < enemies.length; c++) {
	    for (var r = 0; r < enemyRowCount; r++) {
	      var snood = enemies[c][r];
	      if (snood.alive) {
	        if (!initialized) {
	          snood.color = randomColor(snood.x, snood.y);
	        }
	        snood.x = r * (snoodSize * 2) + snoodSize;
	        snood.y = c * (snoodSize * 2) + downShift + snoodSize;
	        if (c % 2 === 0) {
	          snood.x += 25;
	        }
	
	        ctx.beginPath();
	        ctx.arc(snood.x, snood.y, snoodSize, 0, Math.PI * 2);
	        ctx.fillStyle = snood.color;
	        ctx.fill();
	        ctx.closePath();
	      }
	    }
	  }
	  initialized = true;
	}
	
	function drawScore() {
	  ctxScore.translate(100, 0);
	  ctxScore.font = "60px sans-serif";
	  ctxScore.textAlign = "center";
	  ctxScore.fillText(score, 0, 100);
	  ctxScore.translate(-100, 0);
	}
	
	function drawScoreLabels() {
	  ctxScore.translate(100, 0);
	  ctxScore.font = "40px comic-sans";
	  ctxScore.textAlign = "center";
	  ctxScore.fillText("score", 0, 40);
	  ctxScore.translate(-100, 0);
	}
	
	function dropHangingSnoods() {
	  var checked = [];
	  enemies.forEach(function (row) {
	    row.forEach(function (snood) {
	      if (!checked.includes(snood)) {
	        var cluster = getCluster(snood);
	        var anchored = cluster.some(function (clusterSnood) {
	          return clusterSnood.col === 0;
	        });
	
	        if (!anchored) {
	          cluster.forEach(function (snood) {
	            return snood.color = "#000000";
	          });
	        }
	        checked = checked.concat(cluster);
	      }
	    });
	    // anchored = [];
	    // enemies[0].forEach((baseSnood) => {
	    //   // debugger
	    //   if (!anchored.includes(baseSnood)) {
	    //     anchored.concat(getCluster(baseSnood));
	    //   }
	    // });
	  });
	}
	
	function getCluster(snood, included) {
	  included = included || [];
	  var adjSnoods = adjacentSnoods(snood);
	  var newSnoods = filterDoubles(adjSnoods, included);
	  if (newSnoods.length === 0) {
	    return included;
	  }
	  included = included.concat(newSnoods);
	
	  var allSnoods = [];
	  newSnoods.forEach(function (newSnood) {
	    allSnoods = allSnoods.concat(getCluster(newSnood, included));
	  });
	  return allSnoods;
	}
	
	// function isFreeFloating (snood, included) {
	//   if (!included) { included = []; }
	//   included.push(snood);
	//
	//   var allSnoodResponses = ['nope'];
	//   debugger
	//   if (snood.col === 0) {
	//     allSnoodResponses = ['anchored'];
	//   } else {
	//     var adjSnoods = adjacentSnoods(snood);
	//     var newSnoods = filterDoubles(adjSnoods, included);
	//     newSnoods.forEach((adjSnood) => {
	//       allSnoodResponses.concat(isFreeFloating(adjSnood, included));
	//       // if (!allSnoodResponses) { return false; }
	//     });
	//   }
	//   debugger
	//   return allSnoodResponses;
	// }
	
	function fireSnood() {
	  launched = true;
	  var rad = convertToRads(cannonAngle + 90);
	  snoodVX = Math.cos(rad) * snoodSpeed / 60;
	  snoodVY = Math.sin(rad) * snoodSpeed / 60;
	  numberOfShots += 1;
	}
	
	function keyDownHandler(e) {
	  if (e.keyCode == 39) {
	    // right arrow
	    rightPressed = true;
	  } else if (e.keyCode == 37) {
	    // left arrow
	    leftPressed = true;
	  } else if (e.keyCode == 32) {
	    // spacebar launcher
	    fireSnood();
	  }
	}
	
	function filterDoubles(matches, existingMatches) {
	  return matches.filter(function (newMatch) {
	    var repeat;
	    existingMatches.forEach(function (oldMatch) {
	      if (oldMatch.col === newMatch.col && oldMatch.row === newMatch.row) {
	        repeat = true;
	      }
	    });
	
	    if (!repeat) {
	      return newMatch;
	    }
	  });
	}
	
	function keyUpHandler(e) {
	  if (e.keyCode == 39) {
	    rightPressed = false;
	  } else if (e.keyCode == 37) {
	    leftPressed = false;
	  }
	}
	
	function randomColor() {
	  return COLORS[Math.floor(Math.random() * COLORS.length)];
	}
	
	function resetLaunchSnood() {
	  snoodVX = 0;
	  snoodVY = 0;
	  snoodX = gameCanvas.width / 2;
	  snoodY = gameCanvas.height;
	  launched = false;
	  launchSnoodColor = randomColor();
	  if (numberOfShots === 10) {
	    pressDown();
	  }
	}
	
	setInterval(draw, 10);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  bigStuff: function bigStuff() {
	    console.log('eyyyy');
	  }
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map