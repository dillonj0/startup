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
   // console.log('Player name: ' + playerName);
   // console.log('Host name: ' + hostName);
   
   return hostName == playerName;
}

async function play(){
   // send out websocket note to start the game
   if(isHost()){
      try {
         const host = getHostName();
         const response = await fetch('/api/changeGameStatus', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({hostName: host})
         });
         console.log('playing game');
         sendStartCommand();
         window.location.href = 'play.html';
      } catch (error) {
         console.error('error starting game:', error);
         // alert('There was an error starting the game.');
      }
   } else {
      setTimeout ( () => {
         window.location.href = 'nonHost.html';
      }, 10);
   }
}

document.addEventListener('DOMContentLoaded', function(){
   console.log('setting player name');
   AddPlayerName();
})

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

// ====== WEBSOCKET STUFF =========================
// Adjust the webSocket protocol to what is being used for HTTP
const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

// Display that we have opened the webSocket
socket.onopen = (event) => {
  console.log('websocket connection opened');
};

socket.onmessage = function(event) {
   console.log('received from server:', event.data);
   const message = JSON.parse(event.data);
   const host = message.hostName;
   const command = message.command;
   if(host===getHostName() && command === 'start'){
      play();
   }
};

socket.onclose = (event) => {
   alert('lost connection to server; please check connection');
};

function sendStartCommand() {
   const hostName = getHostName(); // Get the host's name
   const message = {
      hostName: hostName,
      command: 'start'
   };

   // Send the message to the WebSocket server
   socket.send(JSON.stringify(message));
}