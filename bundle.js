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

	"use strict";
	
	var Game = __webpack_require__(1);
	
	var game = void 0;
	
	// const resetButton = document.getElementById("reset");
	// resetButton.addEventListener('click', () => {
	//   game = new Game();
	//   game.play();
	// });
	
	document.addEventListener("DOMContentLoaded", function () {
	  game = new Game();
	
	  game.play();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Cannon = __webpack_require__(2);
	var Board = __webpack_require__(4);
	var Snoorp = __webpack_require__(5);
	
	var gameCanvas = document.getElementById("gameCanvas");
	var scoreCanvas = document.getElementById("scoreCanvas");
	var resetButton = document.getElementById('reset');
	
	var ctx = gameCanvas.getContext("2d");
	var ctxScore = scoreCanvas.getContext("2d");
	var snoorpSize = 25;
	
	var winImage = new Image();
	winImage.src = "./images/win_text.png";
	
	var lossImage = new Image();
	lossImage.src = "./images/loss_text.png";
	
	var score = 0;
	var numShots = 0;
	
	var Game = function () {
	  function Game() {
	    _classCallCheck(this, Game);
	
	    // document.activeElement.blur();
	    this.launchSnoorp = this.newSnoorp();
	    this.cannon = this.newCannon();
	    this.board = this.newBoard();
	    resetButton.addEventListener('click', this.resetGame.bind(this));
	  }
	
	  _createClass(Game, [{
	    key: 'newBoard',
	    value: function newBoard() {
	      return new Board({
	        canvas: gameCanvas,
	        ctx: ctx,
	        score: score,
	        launchSnoorp: this.launchSnoorp,
	        snoorpSize: snoorpSize,
	        cannon: this.cannon
	      });
	    }
	  }, {
	    key: 'newSnoorp',
	    value: function newSnoorp() {
	      return new Snoorp({
	        x: gameCanvas.width / 2,
	        y: gameCanvas.height,
	        alive: true
	      });
	    }
	  }, {
	    key: 'newCannon',
	    value: function newCannon() {
	      return new Cannon({
	        ctx: ctx,
	        numShots: numShots,
	        launchSnoorp: this.launchSnoorp
	      });
	    }
	  }, {
	    key: 'drawScore',
	    value: function drawScore() {
	      ctxScore.translate(100, 0);
	      ctxScore.font = "60px sans-serif";
	      ctxScore.textAlign = "center";
	      ctxScore.fillText(this.board.getScore(), 0, 100);
	
	      // draw header
	      ctxScore.font = "40px sans-serif";
	      ctxScore.fillText("score", 0, 40);
	      ctxScore.translate(-100, 0);
	    }
	  }, {
	    key: 'gameOver',
	    value: function gameOver(status) {
	      if (status === 'won') {
	        ctx.drawImage(winImage, 70, 150);
	      } else {
	        ctx.drawImage(lossImage, 20, 150);
	      }
	    }
	  }, {
	    key: 'resetGame',
	    value: function resetGame() {
	      this.launchSnoorp = this.newSnoorp();
	      this.cannon = this.newCannon();
	      this.board = this.newBoard();
	      var c = this.cannon;
	      document.addEventListener("keydown", c.keyDownHandler.bind(c), false);
	      document.addEventListener("keyup", c.keyUpHandler.bind(c), false);
	    }
	  }, {
	    key: 'run',
	    value: function run() {
	      ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	      ctxScore.clearRect(0, 0, 200, 500);
	
	      this.cannon.drawCannonRot();
	      this.board.drawBoard();
	      this.drawScore();
	
	      // checkGameStatus returns null unless game is won or lost
	      var status = this.board.checkGameStatus();
	      if (status) {
	        this.gameOver(status);
	      }
	    }
	  }, {
	    key: 'play',
	    value: function play() {
	      var c = this.cannon;
	      document.addEventListener("keydown", c.keyDownHandler.bind(c), false);
	      document.addEventListener("keyup", c.keyUpHandler.bind(c), false);
	      setInterval(this.run.bind(this), 7);
	    }
	  }]);
	
	  return Game;
	}();
	
	module.exports = Game;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Util = __webpack_require__(3);
	var util = new Util();
	
	var cannonHeight = 70;
	var cannonWidth = 60;
	var launchSpeed = -800;
	
	var Cannon = function () {
	  function Cannon(o) {
	    _classCallCheck(this, Cannon);
	
	    this.ctx = o.ctx;
	    this.angle = 0;
	    this.cannonX = (gameCanvas.width - cannonWidth) / 2;
	    this.cannonY = gameCanvas.height - cannonHeight;
	    this.launched = false;
	    this.launchSnoorp = o.launchSnoorp;
	    this.leftPressed = false;
	    this.rightPressed = false;
	  }
	
	  _createClass(Cannon, [{
	    key: "drawCannon",
	    value: function drawCannon() {
	      this.updateAngle();
	      this.ctx.beginPath();
	      this.ctx.rect(this.cannonX, this.cannonY, cannonWidth, cannonHeight);
	      this.ctx.fillStyle = "#0095DD";
	      this.ctx.fill();
	      this.ctx.closePath();
	    }
	  }, {
	    key: "drawCannonRot",
	    value: function drawCannonRot() {
	      var rad = util.convertToRads(this.angle);
	      // find the pivot point
	      var cannonCenter = gameCanvas.width / 2;
	      var cannonBase = gameCanvas.height;
	      // adjust for gameCanvas translation to put cannon back on the page
	      this.cannonX = -cannonWidth / 2;
	      this.cannonY = -cannonHeight;
	      //rotate, draw, rotate back
	      this.ctx.translate(cannonCenter, cannonBase);
	      this.ctx.rotate(rad);
	      this.drawCannon();
	      this.ctx.rotate(-rad);
	      this.ctx.translate(-cannonCenter, -cannonBase);
	      this.drawCannonBase();
	    }
	  }, {
	    key: "drawCannonBase",
	    value: function drawCannonBase() {
	      this.ctx.beginPath();
	      this.ctx.arc(gameCanvas.width / 2, gameCanvas.height, 50, 0, Math.PI * 2);
	      this.ctx.fillStyle = "#0095DD";
	      this.ctx.fill();
	      this.ctx.closePath();
	    }
	  }, {
	    key: "fireSnoorp",
	    value: function fireSnoorp() {
	      var rad = util.convertToRads(this.angle + 90);
	      this.launched = true;
	      this.launchSnoorp.launched = true;
	      this.launchSnoorp.vx = Math.cos(rad) * launchSpeed / 60;
	      this.launchSnoorp.vy = Math.sin(rad) * launchSpeed / 60;
	    }
	  }, {
	    key: "keyDownHandler",
	    value: function keyDownHandler(e) {
	      switch (e.keyCode) {
	        case 39:
	          // right arrow
	          e.preventDefault();
	          this.rightPressed = true;
	          break;
	        case 37:
	          // left arrow
	          e.preventDefault();
	          this.leftPressed = true;
	          break;
	        case 32:
	          // spacebar
	          e.preventDefault();
	          if (!this.launched) {
	            this.fireSnoorp();
	          }
	          break;
	      }
	    }
	  }, {
	    key: "keyUpHandler",
	    value: function keyUpHandler(e) {
	      if (e.keyCode == 39) {
	        this.rightPressed = false;
	      } else if (e.keyCode == 37) {
	        this.leftPressed = false;
	      }
	    }
	  }, {
	    key: "updateAngle",
	    value: function updateAngle() {
	      if (this.rightPressed) {
	        if (this.angle < 70) {
	          this.angle += 1;
	        }
	      } else if (this.leftPressed) {
	        if (this.angle > -70) {
	          this.angle -= 1;
	        }
	      }
	    }
	  }, {
	    key: "resetLaunch",
	    value: function resetLaunch(newLaunchSnoorp) {
	      this.launched = false;
	      this.launchSnoorp = newLaunchSnoorp;
	    }
	  }]);
	
	  return Cannon;
	}();
	
	module.exports = Cannon;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Util = function () {
	  function Util() {
	    _classCallCheck(this, Util);
	  }
	
	  _createClass(Util, [{
	    key: "adjustedForColVal",
	    value: function adjustedForColVal(target) {
	      var left, right;
	      if (target.col % 2 === 0) {
	
	        left = target.row;
	        right = target.row + 1;
	      } else {
	        left = target.row - 1;
	        right = target.row;
	      }
	
	      return { left: left, right: right };
	    }
	  }, {
	    key: "findCluster",
	    value: function findCluster(matchSnoorp, enemies) {
	      return this.adjacentMatches(matchSnoorp, enemies);
	    }
	  }, {
	    key: "adjacentMatches",
	    value: function adjacentMatches(matchSnoorp, enemies, existingMatches) {
	      var _this = this;
	
	      if (!existingMatches) {
	        existingMatches = [matchSnoorp];
	      }
	      // find all touching snoorps of the same color
	      var matches = this.adjacentSnoorps(matchSnoorp, enemies).filter(function (enemy) {
	        if (enemy.color === matchSnoorp.color) {
	          return enemy;
	        }
	      });
	
	      var newMatches = this.filterDoubles(matches, existingMatches);
	      if (newMatches.length === 0) {
	        return [];
	      }
	
	      // recusively check all new matches for their new matches and combine
	      var allMatches = newMatches.concat(existingMatches);
	      newMatches.forEach(function (enemy) {
	        var newNewMatches = _this.adjacentMatches(enemy, enemies, allMatches);
	        allMatches = allMatches.concat(newNewMatches);
	      });
	      return allMatches;
	    }
	  }, {
	    key: "adjacentSnoorps",
	    value: function adjacentSnoorps(matchSnoorp, enemies) {
	      var targetCol = matchSnoorp.col;
	      var targetRow = matchSnoorp.row;
	      var lr = this.adjustedForColVal(matchSnoorp);
	      var adjacent = [{ col: targetCol - 1, row: lr.left }, // upper left
	      { col: targetCol - 1, row: lr.right }, // upper right
	      { col: targetCol + 1, row: lr.left }, // bottom left
	      { col: targetCol + 1, row: lr.right }, // bottom right
	      { col: targetCol, row: targetRow + 1 }, // right
	      { col: targetCol, row: targetRow - 1 }];
	
	      // return an array of snoorps in adjacent possitions
	      var adjSnoorps = [];
	      adjacent.forEach(function (pos) {
	        if (enemies[pos.col] && enemies[pos.col][pos.row] && enemies[pos.col][pos.row].alive) {
	          adjSnoorps.push(enemies[pos.col][pos.row]);
	        }
	      });
	
	      return adjSnoorps;
	    }
	  }, {
	    key: "convertToRads",
	    value: function convertToRads(deg) {
	      return deg * Math.PI / 180;
	    }
	  }, {
	    key: "filterDoubles",
	    value: function filterDoubles(matches, existingMatches) {
	      var newest = matches.filter(function (newMatch) {
	        var repeat = false;
	        existingMatches.forEach(function (oldMatch) {
	          if (newMatch === oldMatch) {
	            repeat = true;
	          }
	        });
	
	        if (!repeat) {
	          return newMatch;
	        }
	      });
	      return newest;
	    }
	  }]);
	
	  return Util;
	}();
	
	module.exports = Util;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Snoorp = __webpack_require__(5);
	var Util = __webpack_require__(3);
	
	var enemyColumnCount = 3;
	var ceiling = new Image();
	ceiling.source = 'images/wood.png';
	
	var util = new Util();
	
	var Board = function () {
	  function Board(o) {
	    _classCallCheck(this, Board);
	
	    this.canvas = o.canvas;
	    this.ctx = o.ctx;
	    this.launchSnoorp = o.launchSnoorp;
	    this.score = o.score;
	    this.enemyRowCount = (gameCanvas.width - o.snoorpSize) / (o.snoorpSize * 2);
	    this.downShift = 0;
	    this.enemies = [];
	    this.snoorpSize = o.snoorpSize;
	    this.cannon = o.cannon;
	    this.gameStatus = null;
	    this.initialized = false;
	    this.numShots = 0;
	    this.anchored = [];
	
	    this.addEnemies();
	  }
	
	  _createClass(Board, [{
	    key: 'addEnemies',
	    value: function addEnemies() {
	      for (var col = 0; col < enemyColumnCount; col++) {
	        this.enemies[col] = [];
	        for (var row = 0; row < this.enemyRowCount; row++) {
	          var options = {
	            alive: true,
	            visible: true,
	            col: col,
	            row: row,
	            enemies: this.enemies
	          };
	          var snoorp = new Snoorp(options);
	          this.enemies[col][row] = snoorp;
	          this.anchored.push(snoorp);
	        }
	      }
	    }
	  }, {
	    key: 'addLaunchSnoorpToEnemies',
	    value: function addLaunchSnoorpToEnemies(target) {
	      var leftRightVals = util.adjustedForColVal(target);
	      var newPos = this.getAttatchPosition(leftRightVals, target);
	
	      this.launchSnoorp.col = newPos.col;
	      this.launchSnoorp.row = newPos.row;
	
	      if (this.enemies[newPos.col]) {
	        this.enemies[newPos.col][newPos.row] = this.launchSnoorp;
	      } else {
	        this.putInNewRow();
	      }
	    }
	  }, {
	    key: 'destroySnoorps',
	    value: function destroySnoorps() {
	      var cluster = util.findCluster(this.launchSnoorp, this.enemies);
	
	      if (cluster.length > 2) {
	        var count = 0;
	        var multiplier = 0;
	
	        cluster.forEach(function (snoorp) {
	          snoorp.alive = false;
	          snoorp.color = null;
	          count += 1;
	          multiplier += 1;
	        });
	        // adds 10 points per snoorp, multiles by 2 for each additional snoorp
	        this.score += count * 10 * 2;
	      }
	    }
	  }, {
	    key: 'detectCollsion',
	    value: function detectCollsion(target) {
	      var collision = false;
	      // collision with other snoorp
	      if (this.launchSnoorp.launched && this.launchSnoorp.x + this.snoorpSize > target.x - this.snoorpSize && this.launchSnoorp.x - this.snoorpSize < target.x + this.snoorpSize && this.launchSnoorp.y + this.snoorpSize > target.y - this.snoorpSize && this.launchSnoorp.y - this.snoorpSize < target.y + this.snoorpSize) {
	        this.addLaunchSnoorpToEnemies(target);
	        collision = true;
	      } else if (
	      // collision with the ceiling
	      this.launchSnoorp.y - this.snoorpSize + 1 <= 0 + this.downShift) {
	        // avoid overlapping snood placement
	        var rowL = Math.floor(this.launchSnoorp.x / (this.snoorpSize * 2) - 1);
	        var rowR = Math.round(this.launchSnoorp.x / (this.snoorpSize * 2) - 1);
	        var row = this.enemies[0][rowL].alive ? rowR : rowL;
	
	        //place snood in base row
	        this.enemies[0][row] = this.launchSnoorp;
	        // this.anchored.push(this.launchSnoorp);
	        this.launchSnoorp.launched = false;
	        this.launchSnoorp.row = row;
	        this.launchSnoorp.col = 0;
	        collision = true;
	      }
	
	      if (collision) {
	        this.destroySnoorps();
	        this.updateAnchored();
	        this.resetLaunchSnoorp();
	      }
	    }
	  }, {
	    key: 'drawBoard',
	    value: function drawBoard() {
	      this.drawLaunchSnoorp();
	      this.monitorEnemies();
	    }
	  }, {
	    key: 'drawEnemy',
	    value: function drawEnemy(snoorp) {
	      snoorp.x = snoorp.row * (this.snoorpSize * 2) + this.snoorpSize;
	      snoorp.y = snoorp.col * (this.snoorpSize * 2) + this.downShift + this.snoorpSize;
	      // create row offset
	      if (snoorp.col % 2 === 0) {
	        snoorp.x += 25;
	      }
	
	      //drop floating snoorp
	      if (!!snoorp.falling) {
	        if (snoorp.y < this.canvas.height) {
	          snoorp.vy += 10;
	          snoorp.y += snoorp.vy;
	        }
	
	        if (snoorp.y > this.canvas.height) {
	          snoorp.alive = false;
	          snoorp.falling = false;
	          snoorp.vy = 0;
	        }
	      }
	
	      this.drawSnoorp(snoorp);
	    }
	  }, {
	    key: 'drawLaunchSnoorp',
	    value: function drawLaunchSnoorp() {
	      var snoorp = this.launchSnoorp;
	
	      // bounce off the wall
	      var touchingLeft = snoorp.x - this.snoorpSize <= 0;
	      var touchingRight = snoorp.x + this.snoorpSize >= this.canvas.width;
	      if (touchingLeft || touchingRight) {
	        snoorp.vx *= -1;
	      }
	
	      snoorp.x += snoorp.vx;
	      snoorp.y += snoorp.vy;
	
	      this.drawSnoorp(snoorp);
	    }
	  }, {
	    key: 'drawSnoorp',
	    value: function drawSnoorp(snoorp) {
	      this.ctx.drawImage(snoorp.color, snoorp.x - this.snoorpSize, snoorp.y - this.snoorpSize, this.snoorpSize * 2, this.snoorpSize * 2);
	    }
	  }, {
	    key: 'checkGameStatus',
	    value: function checkGameStatus() {
	      return this.gameStatus;
	    }
	  }, {
	    key: 'updateAnchored',
	    value: function updateAnchored() {
	      var _this = this;
	
	      var newAnchored = [];
	      this.enemies[0].forEach(function (anchor) {
	        if (anchor.alive && !newAnchored.includes(anchor)) {
	          newAnchored.push(anchor);
	          newAnchored = newAnchored.concat(_this.getCluster(anchor));
	        }
	      });
	      this.anchored = newAnchored;
	    }
	  }, {
	    key: 'getAttatchPosition',
	    value: function getAttatchPosition(lr, target) {
	      // debugger
	      var col = void 0,
	          row = void 0;
	      var rightish = this.launchSnoorp.x - target.x > 0;
	      if (this.launchSnoorp.y - target.y > 10) {
	        col = target.col + 1; // below
	      } else if (this.launchSnoorp.y - target.y <= 10 && this.launchSnoorp.y - target.y >= -10 || target.col > 0) {
	        col = target.col; // on the same level
	        row = rightish ? target.row + 1 : target.row - 1;
	      } else {
	        col = target.col - 1; // above
	      }
	
	      if (!row) {
	        row = rightish ? lr.right : lr.left;
	      }
	
	      return { col: col, row: row };
	    }
	  }, {
	    key: 'getCluster',
	    value: function getCluster(snoorp, included) {
	      var _this2 = this;
	
	      included = included || [snoorp];
	      var adjSnoorps = util.adjacentSnoorps(snoorp, this.enemies);
	      var newSnoorps = util.filterDoubles(adjSnoorps, included);
	      if (newSnoorps.length === 0) {
	        return [];
	      }
	
	      var allSnoorps = included.concat(newSnoorps);
	      newSnoorps.forEach(function (newSnoorp) {
	        var newNewSnoorps = _this2.getCluster(newSnoorp, allSnoorps);
	        allSnoorps = allSnoorps.concat(newNewSnoorps);
	      });
	      return allSnoorps;
	    }
	  }, {
	    key: 'getScore',
	    value: function getScore() {
	      return this.score;
	    }
	  }, {
	    key: 'monitorEnemies',
	    value: function monitorEnemies() {
	      this.gameStatus = "won";
	      for (var col = 0; col < this.enemies.length; col++) {
	        for (var row = 0; row < this.enemyRowCount; row++) {
	          var target = this.enemies[col][row];
	          if (target.alive) {
	            // check if game is over
	            if (!target.falling && target.y > this.canvas.height - 100) {
	              this.gameStatus = "lost";
	            } else {
	              this.gameStatus = null;
	            }
	
	            if (!this.anchored.includes(target)) {
	              target.falling = true;
	            }
	            this.drawEnemy(target);
	            this.detectCollsion(target);
	          }
	        }
	      }
	      this.initialized = true;
	    }
	  }, {
	    key: 'putInNewRow',
	    value: function putInNewRow() {
	      var newRow = [];
	      for (var row = 0; row < this.enemyRowCount; row++) {
	        if (row === this.launchSnoorp.row) {
	          newRow.push(this.launchSnoorp);
	        } else {
	          newRow.push(new Snoorp({ alive: false })); // blank sentinel
	        }
	      }
	      this.enemies.push(newRow);
	    }
	  }, {
	    key: 'pressDown',
	    value: function pressDown() {
	      this.downShift += this.snoorpSize * 2;
	      this.numShots = 0;
	    }
	  }, {
	    key: 'resetLaunchSnoorp',
	    value: function resetLaunchSnoorp() {
	      this.numShots += 1;
	      if (this.numShots === 5) {
	        this.pressDown();
	      }
	
	      this.launchSnoorp.launched = false;
	      this.launchSnoorp.vx = 0;
	      this.launchSnoorp.vy = 0;
	      var newLaunchSnoorp = new Snoorp({
	        x: this.canvas.width / 2,
	        y: this.canvas.height,
	        alive: true
	      });
	      this.launchSnoorp = newLaunchSnoorp;
	      this.cannon.resetLaunch(newLaunchSnoorp);
	    }
	  }]);
	
	  return Board;
	}();
	
	module.exports = Board;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Util = __webpack_require__(3);
	
	var green = new Image();
	green.src = "images/green.png";
	
	var blue = new Image();
	blue.src = "images/blue.png";
	
	var pink = new Image();
	pink.src = "images/pink.png";
	
	var orange = new Image();
	orange.src = "images/orange.png";
	
	var COLORS = [green, blue, pink]; //, orange];
	var util = new Util();
	
	var remainingColors = [];
	
	var Snoorp = function () {
	  function Snoorp() {
	    var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    _classCallCheck(this, Snoorp);
	
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
	
	  _createClass(Snoorp, [{
	    key: "randomColor",
	    value: function randomColor() {
	      return COLORS[Math.floor(Math.random() * COLORS.length)];
	    }
	  }]);
	
	  return Snoorp;
	}();
	
	module.exports = Snoorp;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map