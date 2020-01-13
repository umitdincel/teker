let contestants = createPlayers(10);

let colors = contestants.map(_ => {
  return getRandomColor();
});

let slices = colors.length;
let sliceDeg = 360/slices;
let deg = rand(0, 360);
let speed = 0;
let slowDownRand = 0;
let ctx = canvas.getContext('2d');
let width = canvas.width; // size
let center = width/2;      // center
let isStopped = false;
let lock = false;

function deg2rad(deg) {
  return deg * Math.PI/180;
}

function drawSlice(deg, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.moveTo(center, center);
  ctx.arc(center, center, width/2, deg2rad(deg), deg2rad(deg+sliceDeg));
  ctx.lineTo(center, center);
  ctx.fill();
}

function drawText(deg, text) {
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(deg2rad(deg));
  ctx.textAlign = "right";
  ctx.fillStyle = "#fff";
  ctx.font = 'normal 1em "Press Start 2P"';
  ctx.fillText(text, 230, 10);
  ctx.restore();
}

function drawImg() {
  ctx.clearRect(0, 0, width, width);

  for(var i=0; i<slices; i++){
    drawSlice(deg, colors[i]);
    drawText(deg+sliceDeg/2, contestants[i]);
    deg += sliceDeg;
  }
}

(function anim() {
  deg += speed;
  deg %= 360;

  if(!isStopped && speed<3){
    speed = speed+1 * 1;
  }

  drawImg();
  window.requestAnimationFrame( anim );
}());
