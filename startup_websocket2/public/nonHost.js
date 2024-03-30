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

   //
   // Send playerid through websocket (so it can pass it to host)
   //

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

// add websocket code: when we get the signal to play, we play