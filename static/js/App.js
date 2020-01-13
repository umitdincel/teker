// websocket host configuration
var host = document.domain + ':' + location.port;
var route = '/spin/' + sessionID;
var ws = new WebSocket('ws://' + host + route);

var room = new Room(document.querySelector('#player-list'));
var wheel = new Wheel();

ws.onmessage = function (event) {
  data = JSON.parse(event.data)

  if(data.remaining_time > 0) {
    new Timer(
      document.querySelector('#timer')
    ).set(data.remaining_time);

    if(data.remaining_time < 5) {
        wheel.slow();
        document.getElementById("join-session-btn").disabled = true;
    }
  } else {
    document.querySelector('#room .remaining-info').innerText = 'session is over';
    document.getElementById("join-session-btn").disabled = true;
  }
  room.update(data.players);
  wheel.setPlayer(data.players, data.remaining_time);
};
