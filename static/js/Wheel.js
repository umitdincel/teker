function Wheel(players = []){
  this.ctx = canvas.getContext('2d');
  this.width = canvas.width;
  this.center = canvas.width/2;

  this.deg = 0;
  this.speed = 0.1;
  this.maxSpeed = 3;
  this.slowDownRand = 0;
  this.lock = false;
  this.activeAnimationID = 0;

  this.players = [];
  this.colors = [];
  this.slices = 0;
  this.sliceDeg = 0;

  this.slowDownRand = 0.994458;
  this.momentum = 1;
}

Wheel.prototype.updatePlayers = function(players) {
  this.players = players;
  this.colors = players.map(_ => {
    return getRandomColor();
  });
  this.slices = players.length;
  this.sliceDeg = 360/players.length;
}

Wheel.prototype.drawSlice = function (color) {
  var ctx = this.ctx;
  var width = this.width;
  var center = this.center;
  var deg = this.deg;
  var sliceDeg = this.sliceDeg;

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.moveTo(center, center);
  ctx.arc(center, center, width/2, deg2rad(deg), deg2rad(deg+sliceDeg));
  ctx.lineTo(center, center);
  ctx.fill();
}

Wheel.prototype.drawPlayer = function (deg, username) {
  var ctx = this.ctx;
  var center = this.center;

  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(deg2rad(deg));
  ctx.textAlign = "right";
  ctx.fillStyle = "#fff";
  ctx.font = 'normal 1em "Press Start 2P"';
  ctx.fillText(username, 230, 10);
  ctx.restore();
}

Wheel.prototype.drawWheel = function() {
  var ctx = this.ctx;
  var sliceDeg = this.sliceDeg;
  var slices = this.slices;
  var width = this.width;

  ctx.clearRect(0, 0, width, width);

  for(var i=0; i < slices; i++){
    this.drawSlice(this.colors[i]);
    this.drawPlayer(this.deg + (sliceDeg / 2), this.players[i]);
    
    this.deg += this.sliceDeg;
  }
}

Wheel.prototype.setPlayer = function(players, remaining_time) {
  var that = this.players;

  var isSubset = players.every(function(val) {
    return that.indexOf(val) > -1;
  });

  if(!isSubset) {
    this.updatePlayers(players);

    if(remaining_time > 5) {
      this.spin();
    } else {
      this.drawWheel();
      document.querySelector('#wheel').classList.add('finish');
    }
  }
}

Wheel.prototype.displayWinner = function(winner) {
  var winnerEl = document.querySelector('.winner');
  
  winnerEl.innerText = winner;
  winnerEl.classList.remove('hide');
}

Wheel.prototype.spin = function(isActiveAnimation) {
  this.deg += this.speed;
  this.deg %= 360;

  if(!this.lock) {
    if(this.speed < this.maxSpeed && this.speed > 0){
      this.speed = this.speed + 0.1;
    }
  } else {
    this.speed = this.speed > 0.2 ? this.speed *= this.slowDownRand : 0;
  }
  
  if(this.activeAnimationID) {
    cancelAnimationFrame(this.activeAnimationID);
  }

  this.drawWheel();
  if(this.speed > 0) {
    this.activeAnimationID = window.requestAnimationFrame(this.spin.bind(this));
  }

  if(this.lock && !this.speed) {
    var winner = Math.floor(((360 - this.deg - 90) % 360) / this.sliceDeg);
    winner = (this.slices+winner) % this.slices;
    
    this.winner = this.players[winner];
    this.displayWinner(this.winner);
  }
}

Wheel.prototype.slow = function() {  
  this.lock = true;
}