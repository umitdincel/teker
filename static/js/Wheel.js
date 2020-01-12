function Wheel(players){
  this.ctx = canvas.getContext('2d');
  this.width = canvas.width;
  this.center = canvas.width/2;

  this.deg = rand(0, 360);
  this.speed = 0;
  this.slowDownRand = 0;
  this.isStopped = false;
  this.lock = false;

  this.colors = players.map(_ => {
    return getRandomColor();
  });
  this.slices = colors.length;
  this.sliceDeg = 360/slices;
}

Wheel.prototype.drawSlice = function (deg, color) {
  var ctx = this.ctx;
  var center = this.center;

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.moveTo(center, center);
  ctx.arc(center, center, width/2, deg2rad(deg), deg2rad(deg+sliceDeg));
  ctx.lineTo(center, center);
  ctx.fill();
}

Wheel.prototype.drawText = function (deg, text) {
  var ctx = this.ctx;
  var center = this.center;

  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(deg2rad(deg));
  ctx.textAlign = "right";
  ctx.fillStyle = "#fff";
  ctx.font = 'normal 1em "Press Start 2P"';
  ctx.fillText(text, 230, 10);
  ctx.restore();
}

Wheel.prototype.drawImg = function() {
  var ctx = this.ctx;

  ctx.clearRect(0, 0, width, width);

  for(var i=0; i<this.slices; i++){
    this.drawSlice(deg, colors[i]);
    this.drawText(deg+sliceDeg/2, contestants[i]);
    deg += sliceDeg;
  }
}

Wheel.prototype.spin = function() {
  var speed = this.speed;

  deg += speed;
  deg %= 360;

  if(!this.isStopped && speed<3){
    speed = speed+1 * 1;
  }

  this.drawImg();

  window.requestAnimationFrame(this.spin);
}