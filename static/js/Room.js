function Room(selector, bonus) {
  this.selector = selector;
  this.perBonusPoint = bonus || 10;
}

Room.prototype.createPlayer = function (username) {
  var li = document.createElement("li");
  var span = document.createElement("span");

  span.innerText = '+' + this.perBonusPoint.toString();
  li.innerText = username;
  li.appendChild(span);

  return li;
}

Room.prototype.updateList = function(players) {
  var playerList = this.selector;
  var that = this;

  playerList.innerHTML = '';
  players.forEach(function (player){
    playerList.appendChild(
      that.createPlayer(player)
    );
  });
}

Room.prototype.updateTotalNumbers = function(totalPlayer) {
  document.querySelector('#total-player span').innerText = totalPlayer;
  document.querySelector('#total-bonus span').innerText = '+' + totalPlayer * this.perBonusPoint;
}

Room.prototype.update = function(players) {
  this.updateList(players);
  this.updateTotalNumbers(players.length);
}