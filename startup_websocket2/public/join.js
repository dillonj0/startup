function AddPlayerName() {
   console.log("starting to set player name...")
   const playerNameElement = document.querySelector('#player-name');
   let usernameString = getPlayerName();
   playerNameElement.textContent = usernameString;
   console.log("set player name");
}

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

async function PopulateGameList(){
   try {
      const response = await fetch('/api/gameList');
      const gameListObject = await response.json();
      const gameList = Object.values(gameListObject);
      console.log(gameList);
      const gameTable = document.getElementById('game-list');
      gameList.forEach(entry => {
         const row = document.createElement('tr');
         row.className = 'game-row';
         const hostNameEl = document.createElement('td');
         hostNameEl.id = 'game-row-el';
         const statusEl = document.createElement('td');
         statusEl.id = 'game-row-el';
         const joinButtontdEl = document.createElement('td');
         const joinButtonEl = document.createElement('button');
         joinButtonEl.className = 'btn btn-outline-secondary';
         joinButtonEl.id = 'game-row-el';

         // Set inner text for each element    
         // Disable button if playing  
         hostNameEl.textContent = entry.hostName;
         statusEl.textContent = entry.status;
         if(entry.status === 'open'){
            joinButtonEl.innerText = 'join';
            joinButtonEl.onclick = () => joinGame(entry.hostName);
         } else {
            joinButtonEl.innerText = 'playing';
            joinButtonEl.disabled = true;
         }

         row.appendChild(hostNameEl);
         row.appendChild(statusEl);
         joinButtontdEl.appendChild(joinButtonEl);
         row.appendChild(joinButtontdEl);

         gameTable.appendChild(row);
      });
   } catch (error) {
      console.log(error);
      alert('Could not connect to server. Some functionality may be offline.')
   }
}

async function newGame(){
   // create a new game, redirect to lobby
   console.log('creating new game');
   const host = getPlayerName();
   try {
      const response = await fetch('/api/createGame', {
         method: 'POST',
         headers: {'content-type': 'application/json'},
         body: JSON.stringify({hostName: host})
      });
      if (response.status === 409){
         // alert the user that they game is already made
         alert('Another game is already live with the same host name.')
      } else {
         console.log('created a new game!');
         localStorage.setItem('HostName', getPlayerName());
         window.location.href = 'lobby.html';
      }
   } catch (error) {
      console.log('could not create new game:', error);
   }
}

async function joinGame(hostName){
   // join an existing game, redirect to lobby
   console.log('joining game with hostname', hostName);
   localStorage.setItem('hostName', hostName);
   window.location.href = 'lobby.html';
}

document.addEventListener('DOMContentLoaded', function(){
   console.log('setting player name');
   AddPlayerName();
   
   console.log('retrieving open games:');
   PopulateGameList();
})

if(!isAuthenticated()){
   window.location.href = 'index.html';
   console.log('Not authenticated!!!');
}