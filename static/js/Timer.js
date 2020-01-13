function Timer(selector) {
  this.selector = selector;
  this.second = 1000;
}

Timer.prototype.set = function(duration) {
  var timer = duration, minutes, seconds;
  var display = this.selector;

  minutes = parseInt(duration / 60, 10);
  seconds = parseInt(duration % 60, 10);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  display.textContent = minutes + ":" + seconds;

  if (--duration < 0) {
    timer = duration;
  }
}
