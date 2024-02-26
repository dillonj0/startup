function buildPage() {
   const playerNameElement = document.querySelector('#player-name');
   playerNameElement.textContent = ("Player: "+ getPlayerName());
   console.log("set player name")
}

function getPlayerName() {
   return localStorage.getItem('userName');
}