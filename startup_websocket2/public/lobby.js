function AddPlayerName() {
   console.log("starting to set player name...")
   const playerNameElement = document.querySelector('#player-name');
   let usernameString = getPlayerName();
   playerNameElement.textContent = usernameString;
   console.log("set player name");

   const hostNameElement = document.querySelector('#host-name');
   let hostName = getHostName();
   let hostText = hostName + ' is the host.'
   hostNameElement.textContent = hostText;
   console.log('set host name');
}

document.addEventListener('DOMContentLoaded', function(){
   console.log('setting player name');
   AddPlayerName();
})

function getPlayerName() {
   return localStorage.getItem('userName');
}

function getHostName() {
   return localStorage.getItem('hostName');
}

function isAuthenticated(){
   username = localStorage.getItem("userName");
   if(username){
      return true;
   }
   return false;
}

function isHost() {
   const hostName = getHostName();
   const playerName = getPlayerName();
   console.log('Player name: ' + playerName);
   console.log('Host name: ' + hostName);
   
   return hostName == playerName;
}

if(!isAuthenticated()){
   window.location.href = 'index.html';
   console.log('Not authenticated!!!');
} else if (isHost()) {
   console.log('is host');
   const startGameElement = document.querySelector('#start-button');
   startGameElement.style.display = 'flex';
} else {
   const waitForGameElement = document.querySelector('#wait');
   waitForGameElement.style.display = 'flex';
}

function play(){
   // send out websocket note to start the game
   console.log('playing game');
   if(isHost()){
      window.location.href = 'play.html';
   } else {
      window.location.href = 'nonHost.html';
   }
}