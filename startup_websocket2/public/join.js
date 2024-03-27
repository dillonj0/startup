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

async function newGame(){
   // create a new game, redirect to lobby
   console.log('creating new game');
   host = getPlayerName();
   try {
      await fetch('/api/createGame', {
         method: 'POST',
         headers: {'content-type': 'application/json'},
         body: JSON.stringify({hostName: host})
      });
      console.log('created new game!')
   } catch (error) {
      console.log('could not create new game:', error);
   }
}

function joinGame(gameID){
   // join an existing game, redirect to lobby
}