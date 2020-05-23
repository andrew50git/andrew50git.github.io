class Game {
  //constructor
  constructor() {
    this.time = "Last run: NaN seconds";
    this.highscore = "Highscore: NaN seconds";
    this.realHighscore = Infinity;
    this.canvas = document.getElementById("canvas");
    this.pen = this.canvas.getContext("2d");
    this.reset();
  }
  reset() {
    this.startTime = new Date().getTime();
    this.canvas.onclick = function() {
      doc.webkitRequestFullscreen();
    }
    this.playerSize = 20;
    this.mapX = -300;
    this.mapY = -300;
    this.yVel = 0;
    this.xVel = 0;
    this.level1 = [-200,-100,-100,100,
      100,-375,200,100,
      -200,100,200,150,
      800,100,900,150,
      -600,-100,-100,0,
      250,300,400,400,
      700,700,1500,800];
    this.end = [1600,600,1700,700];
    this.lava = [-100,-350,0,100,
                1200,600,1400,700];
    this.bounce = [0,0,100,100];
    this.currLevel = this.level1;
    this.arrowUp = false;
    this.arrowLeft = false;
    this.arrowRight = false;
  }
  restart(resetTime) {
    if (resetTime) {
      this.startTime = new Date().getTime();
    }
    this.mapX=-300;
    this.mapY=-300;
    this.xVel=0;
    this.yVel=0;
  }
  //collision
  movePlayer() {
    this.moveLR();
    this.moveUD();
    this.collideBound();
  }
  collideBound() {
    if (this.mapY>4000) {
      this.restart(false);
    }
  }
  moveUD() {
    for (var i=0;i<5;i+=1) {
      if (this.collided(this.currLevel)) {
        this.mapY-=1;
      }
    }
    if (this.collided(this.currLevel)) {
      this.mapY+=12;
    }
    this.yVel+=0.25;
    this.mapY+=this.yVel;
    if (this.collided(this.currLevel)) {
      this.mapY-=this.yVel;
      this.yVel=0;
    }
    this.mapY+=1;
    if (this.arrowUp && this.collided(this.currLevel)) {
      this.yVel=-12+Math.abs(this.xVel);
    }
    this.mapY-=1;
  }
  moveLR() {
    if (this.arrowLeft) {
      this.xVel-=1;
    } else if (this.arrowRight) {
      this.xVel+=1;
    } else {

    }
    this.xVel*=0.9;
    this.mapX+=this.xVel;
    this.bounceLR();
  }
  collided(level) {
    const playerRect = [this.mapX-this.playerSize,this.mapY-this.playerSize,
      this.mapX+this.playerSize,this.mapY-this.playerSize,
      this.mapX+this.playerSize,this.mapY+this.playerSize,
      this.mapX-this.playerSize,this.mapY+this.playerSize];
    for (var i=0; i<level.length; i+=4) {
      for (var j=0; j<playerRect.length; j+=2) {
        if (playerRect[j]>level[i] && playerRect[j]<level[i+2] && playerRect[j+1]>level[i+1] && playerRect[j+1]<level[i+3]) {
          return true;
        }
      }
    }
    return false;
  }
  bounceLR() {
    if (this.collided(this.currLevel)) {
      this.mapX+=-this.xVel;
      this.xVel=0;
    }
  }
  checkEnd() {
    if (this.collided(this.end)) {
      this.realTime=(new Date().getTime()-this.startTime)/1000;
      this.time = "Last run: "+this.realTime+" seconds";
      if (this.realTime<this.realHighscore) {
        this.realHighscore=this.realTime;
        this.highscore = "Highscore: "+this.realHighscore+" seconds";
      }
      this.restart(true);
    }
  }
  checkLava() {
    if (this.collided(this.lava)) {
      this.restart(false);
    }
  }
  checkBounce() {
    if (this.collided(this.bounce)) {
      this.yVel=-15;
    }
  }
  //mainloop
  updateCanvas() {
    this.resetCanvas();
    this.relX = this.canvasWidth/2;
    this.relY = this.canvasHeight/2;
    this.drawPlayer(this.relX,this.relY);
    this.drawPlatforms(this.mapX,this.mapY,this.currLevel,this.end,this.lava,this.bounce);
    this.drawText(this.canvas.width*0.1,100,this.time,"white");
    this.drawText(this.canvas.width*0.8,100,this.highscore,"white");
    this.movePlayer();
    this.checkEnd();
    this.checkLava();
    this.checkBounce();
  }
  //canvas actions
  resetCanvas() {
    this.canvasWidth = window.innerWidth-15;
    this.canvasHeight = window.innerHeight-100;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
  }
  drawPlayer(x,y) {
    this.rect(x-this.playerSize,y-this.playerSize,x+this.playerSize,
      y+this.playerSize,"green");
  }
  drawPlatforms(x,y,platforms,end,lava,bounce) {
    for (var i=0;i<platforms.length;i+=4) {
      this.rect(platforms[i]-this.mapX+this.relX,
        platforms[i+1]-this.mapY+this.relY,platforms[i+2]-this.mapX+this.relX,
        platforms[i+3]-this.mapY+this.relY,"white");
    }
    for (var i=0;i<end.length;i+=4) {
      this.rect(end[i]-this.mapX+this.relX,
        end[i+1]-this.mapY+this.relY,end[i+2]-this.mapX+this.relX,
        end[i+3]-this.mapY+this.relY,"blue");
    }
    for (var i=0;i<lava.length;i+=4) {
      this.rect(lava[i]-this.mapX+this.relX,
        lava[i+1]-this.mapY+this.relY,lava[i+2]-this.mapX+this.relX,
        lava[i+3]-this.mapY+this.relY,"red");
    }
    for (var i=0;i<bounce.length;i+=4) {
      this.rect(bounce[i]-this.mapX+this.relX,
        bounce[i+1]-this.mapY+this.relY,bounce[i+2]-this.mapX+this.relX,
        bounce[i+3]-this.mapY+this.relY,"orange");
    }
  }
  //draw
  rect(startx,starty,endx,endy,color) {
    this.pen.strokeStyle = color;
    this.pen.fillStyle = color;
    this.pen.beginPath();
    this.pen.moveTo(startx,starty);
    this.pen.lineTo(endx,starty);
    this.pen.lineTo(endx,endy);
    this.pen.lineTo(startx,endy);
    this.pen.lineTo(startx,starty);
    this.pen.fill();
    this.pen.stroke();
  }
  drawText(x,y,text,color) {
    this.pen.font = "30px Arial";
    this.pen.fillStyle = color;
    this.pen.fillText(text,x,y);
    this.pen.stroke();
  }
}

function keyDown(event) {
  if (event.code == "ArrowUp") {
    game.arrowUp = true;
  } else if (event.code == "ArrowLeft") {
    game.arrowLeft = true;
  } else if (event.code == "ArrowRight") {
    game.arrowRight = true;
  } else {

  }
}

function keyUp(event) {
  if (event.code == "ArrowUp") {
    game.arrowUp = false;
  } else if (event.code == "ArrowLeft") {
    game.arrowLeft = false;
  } else if (event.code == "ArrowRight") {
    game.arrowRight = false;
  } else {

  }
}

function waitStart(event) {
  if (event.code == "Enter") {
    startGame();
  }
}

const doc = document.documentElement;
const canvas = document.getElementById("canvas");
canvas.style.display = "none";
const game = new Game();
document.addEventListener("keydown",waitStart);
function startGame() {
  canvas.style.display = "block";
  document.addEventListener("keydown",keyDown);
  document.addEventListener("keyup",keyUp);
  game.mainloop = setInterval(function() {game.updateCanvas();},15);
}
