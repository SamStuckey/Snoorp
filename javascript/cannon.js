const Util = require('./util');
const util = new Util();

const cannonHeight = 70;
const cannonWidth = 60;
const launchSpeed = -800;

class Cannon {
  constructor (o) {
    this.ctx = o.ctx;
    this.angle = 0;
    this.cannonX = (gameCanvas.width - cannonWidth) / 2;
    this.cannonY = (gameCanvas.height - cannonHeight);
    this.launched = false;
    this.launchSnoorp = o.launchSnoorp;
    this.leftPressed = false;
    this.rightPressed = false;
  }

  drawCannon () {
    this.updateAngle();
    this.ctx.beginPath();
    this.ctx.rect(this.cannonX, this.cannonY, cannonWidth, cannonHeight);
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawCannonRot () {
    const rad = util.convertToRads(this.angle);
    // find the pivot point
    const cannonCenter = gameCanvas.width / 2;
    const cannonBase = gameCanvas.height;
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

  drawCannonBase () {
    this.ctx.beginPath();
    this.ctx.arc(gameCanvas.width / 2, gameCanvas.height, 50, 0, Math.PI*2);
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();
    this.ctx.closePath();
  }

  fireSnoorp () {
    const rad = util.convertToRads(this.angle + 90);
    this.launched = true;
    this.launchSnoorp.launched = true;
    this.launchSnoorp.vx = Math.cos(rad)*launchSpeed/60;
    this.launchSnoorp.vy = Math.sin(rad)*launchSpeed/60;
  }

  keyDownHandler (e) {
    e.preventDefault();
    switch (e.keyCode){
      case 39: // right arrow
      this.rightPressed = true;
      break;
      case 37: // left arrow
      this.leftPressed = true;
      break;
      case 32: // spacebar
      if (!this.launched) { this.fireSnoorp(); }
      break;
    }
  }

  keyUpHandler (e) {
    e.preventDefault();
    if(e.keyCode == 39) {
      this.rightPressed = false;
    }
    else if(e.keyCode == 37) {
      this.leftPressed = false;
    }
  }

  updateAngle () {
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

  resetLaunch (newLaunchSnoorp) {
    this.launched = false;
    this.launchSnoorp = newLaunchSnoorp;
  }
}

module.exports = Cannon;
