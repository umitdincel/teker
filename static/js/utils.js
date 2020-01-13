function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
};

function rand(min, max) {
  return Math.random() * (max - min) + min;
};

function deg2rad(deg) {
  return deg * Math.PI/180;
};

// for testing
function createPlayerList(n) {
  return Array.apply(null, Array(n)).map((_, i) => {
    return 'Player ' + (i+1);
  });
};

function createPlayers(n) {
  return Array.apply(null, Array(n)).map((_, i) => {
    return 'Player ' + (i+1);
  });
}