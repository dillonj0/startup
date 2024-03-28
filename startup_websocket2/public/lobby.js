function AddPlayerName() {
   console.log("starting to set player name...")
   const playerNameElement = document.querySelector('#player-name');
   let usernameString = getPlayerName();
   playerNameElement.textContent = usernameString;
   console.log("set player name");

   const hostNameElement = document.querySelector('#host-name');
   let hostName = getHostName();
   hostNameElement.textContent = hostName;
   console.log('set host name');
}

document.addEventListener('DOMContentLoaded', function(){
   AddPlayerName();
   console.log('setting player name');
})

function getPlayerName() {
   return localStorage.getItem('userName');
}

function getHostName() {
   return 'lobby.js getHostName(): FUNCTION DOES NOT GET HOST NAME.';
}

function isAuthenticated(){
   username = localStorage.getItem("userName");
   if(username){
      return true;
   }
   return false;
}

function isHost() {
   return true;
}

if(!isAuthenticated()){
   window.location.href = 'index.html';
   console.log('Not authenticated!!!');
} else if (isHost()) {
   const startGameElement = document.querySelector('#start-button');
   startGameElement.style.display = 'flex';
} else {
   const waitForGameElement = document.querySelector('#wait');
   waitForGameElement.style.display = 'flex';
}

function play(){
   // send out websocket note to start the game
   console.log('playing game');
   window.location.href = 'play.html';
}