function AddPlayerName() {
   console.log("starting to set player name...")
   const playerNameElement = document.querySelector('#player-name');
   let usernameString = getPlayerName();
   playerNameElement.textContent = usernameString;
   console.log("set player name");
}

document.addEventListener('DOMContentLoaded', function(){
   AddPlayerName();
   console.log('setting player name');
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

if(!isAuthenticated()){
   window.location.href = 'index.html';
   console.log('Not authenticated!!!');
}

function snatch() {
   const playerid = getPlayerName();

   notifyWebsocket();

   // Disable the snatch button so it can't be clicked again.
   document.getElementById('snatch-button').disabled = true;
   document.getElementById('snatch-button').textContent = "Snatched!";

   // Set up which elements we're talking about
   console.log('snatch ' + playerid);
   const playerScoreboardElement = document.getElementById(playerid);
   const scoreImgElement = document.querySelector('.player-icon');
   const scoreElement = document.querySelector('.mallow-count');
}

function endRound() {
   if(document.getElementById('snatch-button').disabled === false){
      document.getElementById('snatch-button').disabled = true;
      document.getElementById('snatch-button').textContent = "😵";
   }
}

function roundReset() {
   document.getElementById('snatch-button').disabled = false;
   document.getElementById('snatch-button').textContent = "Snatch now!";
}

// add websocket code:
// when a user presses the button, notify the server, update scoreboard on host
// when a round ends, roundReset()

// ====== WEBSOCKET STUFF =========================
// Adjust the webSocket protocol to what is being used for HTTP
const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

// Display that we have opened the webSocket
socket.onopen = (event) => {
   console.log('websocket connection opened');
   // Wait for half a second
   setTimeout(() => {
       // Send a message so the host knows who's in the game.
       const hostName = getHostName();
       const command = 'join';
       const userName = getPlayerName();
       const message = {
           hostName: hostName,
           command: 'join',
           userName: userName
       };

       // Send the message to the WebSocket server
       socket.send(JSON.stringify(message));
   }, 500);
};

socket.onmessage = function(event) {
   console.log('received from server:', event.data);
   const message = JSON.parse(event.data);
   const host = message.hostName;
   const command = message.command;
   if (host === getHostName()) {
       if (command === 'round-end') {
           endRound();
       } else if (command === 'round-start') {
           roundReset();
       } else if (command === 'finished') {
         alert('The host has ended the game. You will be redirected to the lobby.');
         window.location.href = 'join.html';
       }
   }
};

socket.onclose = (event) => {
   if(alert('lost connection to server; please check connection')){
      window.location.href='index.html';
   }
};


function notifyWebsocket(){
   const hostName = getHostName();
   const command = 'snatch';
   const userName = getPlayerName();
   const message = {
      hostName: hostName,
      command: command,
      userName: userName
   };

   // Send the message to the WebSocket server
   socket.send(JSON.stringify(message));
}

