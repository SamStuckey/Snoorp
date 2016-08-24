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
	
	document.addEventListener("DOMContentLoaded", function () {
	  var game = new Game();
	  game.play();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Cannon = __webpack_require__(2);
	var Board = __webpack_require__(3);
	var Snoorp = __webpack_require__(4);
	
	var gameCanvas = document.getElementById("gameCanvas");
	var scoreCanvas = document.getElementById("scoreCanvas");
	var ctx = gameCanvas.getContext("2d");
	var ctxScore = scoreCanvas.getContext("2d");
	var snoorpSize = 25;
	
	var score = 0;
	var numShots = 0;
	
	var Game = function () {
	  function Game() {
	    _classCallCheck(this, Game);
	
	    this.launchSnoorp = this.newSnoorp();
	    this.cannon = this.newCannon();
	    this.board = this.newBoard();
	  }
	
	  _createClass(Game, [{
	    key: 'newBoard',
	    value: function newBoard() {
	      return new Board({
	        canvas: gameCanvas,
	        ctx: ctx,
	        score: score,
	        launchSnoorp: this.launchSnoorp,
	        snoorpSize: snoorpSize
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
	      ctxScore.fillText(score, 0, 100);
	
	      // draw header
	      ctxScore.font = "40px sans-serif";
	      ctxScore.fillText("score", 0, 40);
	      ctxScore.translate(-100, 0);
	    }
	  }, {
	    key: 'run',
	    value: function run() {
	      ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	      ctxScore.clearRect(0, 0, 200, 500);
	
	      this.cannon.drawCannonRot();
	      this.board.drawBoard();
	      this.drawScore();
	      // checkGameOver();
	    }
	  }, {
	    key: 'play',
	    value: function play() {
	      var c = this.cannon;
	      document.addEventListener("keydown", c.keyDownHandler.bind(c), false);
	      document.addEventListener("keyup", c.keyUpHandler.bind(c), false);
	      setInterval(this.run.bind(this), 10);
	    }
	  }]);
	
	  return Game;
	}();
	
	module.exports = Game;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
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
	    this.numShots = o.numShots;
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
	      var rad = this.convertToRads(this.angle);
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
	    key: "convertToRads",
	    value: function convertToRads(deg) {
	      return deg * Math.PI / 180;
	    }
	  }, {
	    key: "fireSnoorp",
	    value: function fireSnoorp() {
	      var rad = this.convertToRads(this.angle + 90);
	      this.launched = true;
	      this.launchSnoorp.vx = Math.cos(rad) * launchSpeed / 60;
	      this.launchSnoorp.vy = Math.sin(rad) * launchSpeed / 60;
	      this.numShots += 1;
	    }
	  }, {
	    key: "keyDownHandler",
	    value: function keyDownHandler(e) {
	      switch (e.keyCode) {
	        case 39:
	          // right arrow
	          this.rightPressed = true;
	          break;
	        case 37:
	          // left arrow
	          this.leftPressed = true;
	          break;
	        case 32:
	          // spacebar
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
	  }]);
	
	  return Cannon;
	}();
	
	module.exports = Cannon;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Snoorp = __webpack_require__(4);
	
	var enemyColumnCount = 4;
	var initialized = false;
	
	var Board = function () {
	  function Board(o) {
	    _classCallCheck(this, Board);
	
	    this.canvas = o.canvas;
	    this.ctx = o.ctx;
	    this.launchSnoorp = o.launchSnoorp;
	    this.score = o.score;
	    this.enemyRowCount = (gameCanvas.width - o.snoorpSize) / (o.snoorpSize * 2);
	    this.enemies = [];
	    this.downShift = 0;
	    this.snoorpSize = o.snoorpSize;
	
	    this.addEnemies();
	  }
	
	  _createClass(Board, [{
	    key: 'addEnemies',
	    value: function addEnemies() {
	      for (var col = 0; col < enemyColumnCount; col++) {
	        this.enemies[col] = [];
	        for (var _row = 0; _row < this.enemyRowCount; _row++) {
	          var options = { alive: true, visible: true, col: col, row: _row };
	          this.enemies[col][_row] = new Snoorp(options);
	        }
	      }
	    }
	  }, {
	    key: 'addLaunchSnoorpToEnemies',
	    value: function addLaunchSnoorpToEnemies(target) {
	      var LeftRightVals = this.adjustedForColVal(target);
	      var newPos = this.getAttatchPosition(LeftRightVals, target);
	      this.launchSnoorp.col = newPos.col;
	      this.launchSnoorp.row = newPos.row;
	
	      if (this.board.enemies()[newPos.col]) {
	        this.board.enemies()[newPos.col][newPos.row] = this.launchSnoorp;
	      } else {
	        this.putInNewRow();
	      }
	    }
	  }, {
	    key: 'putInNewRow',
	    value: function putInNewRow() {
	      var newRow = [];
	      for (var r = 0; r < this.enemyRowCount; r++) {
	        if (r === this.launchSnoorp.rowPos) {
	          row.push(this.launchSnoorp);
	        } else {
	          row.push(new Snoorp({ alive: false })); // blank sentinel
	        }
	      }
	      enemies.push(row);
	    }
	  }, {
	    key: 'destroySnoorps',
	    value: function destroySnoorps() {
	      var cluster = this.launchSnoorp.adjacentMatches();
	
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
	        this.dropHangingSnoorps();
	      }
	    }
	  }, {
	    key: 'detectCollsion',
	    value: function detectCollsion(target) {
	      if ( // collision with other snoorp
	      this.launchSnoorp.x + this.snoorpSize > target.x - this.snoorpSize && this.launchSnoorp.x - this.snoorpSize < target.x + this.snoorpSize && this.launchSnoorp.y + this.snoorpSize > target.y - this.snoorpSize && this.launchSnoorp.y - this.snoorpSize < target.y + this.snoorpSize) {
	        this.addLaunchSnoorpToEnemies(target);
	        this.destroySnoorps();
	      } else if ( // collision with the ceiling
	      this.launchSnoorp.y - this.snoorpSize + 1 <= 0 + this.downShift) {
	        var _row2 = Math.round(this.launchSnoorp.x / (this.snoorpSize * 2) - 1);
	        enemies[0][_row2] = this.launchSnoorp;
	      }
	      this.resetLaunchSnoorp();
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
	      snoorp.x = snoorp.x || snoorp.row * (this.snoorpSize * 2) + this.snoorpSize;
	      snoorp.y = snoorp.col * (this.snoorpSize * 2) + this.downShift + this.snoorpSize;
	      // create row offset
	      if (snoorp.col % 2 === 0 && !initialized) {
	        snoorp.x += 25;
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
	      this.ctx.beginPath();
	      this.ctx.arc(snoorp.x, snoorp.y, this.snoorpSize, 0, Math.PI * 2);
	      this.ctx.fillStyle = snoorp.color;
	      this.ctx.fill();
	      this.ctx.closePath();
	    }
	  }, {
	    key: 'monitorEnemies',
	    value: function monitorEnemies() {
	      for (var col = 0; col < this.enemies.length; col++) {
	        for (var _row3 = 0; _row3 < this.enemyRowCount; _row3++) {
	          var target = this.enemies[col][_row3];
	          if (target.alive) {
	            this.detectCollsion(target);
	            this.drawEnemy(target);
	            if (target.falling) {
	              this.moveFallingSnoorps(target);
	            }
	          }
	        }
	      }
	      initialized = true;
	    }
	  }, {
	    key: 'moveFallingSnoorps',
	    value: function moveFallingSnoorps(snoorp) {
	      if (snoorp.y < this.canvas.height) {
	        snoorp.y *= 1.2;
	      } else {
	        snoorp.alive = false;
	        snoorp.falling = false;
	      }
	    }
	  }, {
	    key: 'getAttatchPosition',
	    value: function getAttatchPosition(lr, target) {
	      var col = void 0,
	          row = void 0;
	      if (this.launchSnoorp.y - target.y > 10) {
	        col = target.col + 1; // below
	      } else if (this.launchSnoorp.y - target.y < 10 && this.launchSnoorp.y - target.y > -10) {
	        col = target.col; // on the same level
	      } else {
	        col = target.col - 1; // above
	      }
	
	      row = this.launchSnoorp.x - target.x > 0 ? lr.right : lr.left;
	
	      return { col: col, row: row };
	    }
	  }, {
	    key: 'pressDown',
	    value: function pressDown() {
	      this.downShift += this.snoorpSize * 2;
	    }
	  }, {
	    key: 'resetLaunchSnoorp',
	    value: function resetLaunchSnoorp() {
	      this.launchSnoorp = new Snoorp({
	        x: this.canvas.width / 2,
	        y: this.canvas.height,
	        alive: true
	      });
	    }
	  }]);
	
	  return Board;
	}();
	
	module.exports = Board;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var COLORS = ['#004FFA', '#00FA2E', '#FA00CC', '#FAAB00', '#FAFA00'];
	
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
	    this.yx = 0;
	    this.launched = false;
	  }
	
	  _createClass(Snoorp, [{
	    key: 'adjustedForColVal',
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
	    key: 'adjacentMatches',
	    value: function (_adjacentMatches) {
	      function adjacentMatches(_x) {
	        return _adjacentMatches.apply(this, arguments);
	      }
	
	      adjacentMatches.toString = function () {
	        return _adjacentMatches.toString();
	      };
	
	      return adjacentMatches;
	    }(function (existingMatches) {
	      if (!existingMatches) {
	        existingMatches = [];
	      }
	
	      // find all touching snoorps of the same color
	      var matches = this.adjacentSnoorps().filter(function (snoorp) {
	        if (snoorp.color === matchsnoorp.color) {
	          return snoorp;
	        }
	      });
	
	      var newMatches = filterDoubles(matches, existingMatches);
	      if (newMatches.length === 0) {
	        return [];
	      }
	
	      // recusively check all new matches for their new matches and combine
	      var allMatches = newMatches.concat(existingMatches);
	      newMatches.forEach(function (snoorp) {
	        newMatches = newMatches.concat(adjacentMatches(snoorp, allMatches));
	      });
	
	      return newMatches;
	    })
	  }, {
	    key: 'adjacentSnoorps',
	    value: function adjacentSnoorps() {
	      var _this = this;
	
	      var targetCol = this.col;
	      var targetRow = this.row;
	      var lr = adjustedForColVal(snoorp);
	      adjacent = [{ col: targetCol - 1, row: lr.left }, // upper left
	      { col: targetCol - 1, row: lr.right }, // upper right
	      { col: targetCol + 1, row: lr.left }, // bottom left
	      { col: targetCol + 1, row: lr.right }, // bottom right
	      { col: targetCol, row: targetRow + 1 }, // right
	      { col: targetCol, row: targetRow - 1 }, // left
	      { col: targetCol - 1, row: targetRow }, // above
	      { col: targetCol + 1, row: targetRow }];
	
	      // return an array of snoorps in adjacent possitions
	      return adjacent.filter(function (pos) {
	        var enemies = _this.board.enemies();
	        if (enemies[pos.col] && enemies[pos.col][pos.row] && enemies[pos.col][pos.row].alive) {
	          return _this.board.enemies[pos.col][pos.row];
	        }
	      });
	    }
	  }, {
	    key: 'filterDoubles',
	    value: function filterDoubles(matches, existingMatches) {
	      return matches.filter(function (newMatch) {
	        var repeat;
	        existingMatches.forEach(function (oldMatch) {
	          if (newMatch === oldMatch) {
	            repeat = true;
	          }
	        });
	
	        if (!repeat) {
	          return newMatch;
	        }
	      });
	    }
	  }, {
	    key: 'randomColor',
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