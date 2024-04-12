import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink from react-router-dom

export function Join() {
  const [playerName, setPlayerName] = useState('');
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('userName');
    if(storedUsername) {
      setPlayerName(storedUsername);
      PopulateGameList(); // Call PopulateGameList when component mounts
    } else {
      window.location.href='/';
      console.log('NOT AUTHENTICATED');
    }
  }, []);

  const newGame = async () => {
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
          localStorage.setItem('hostName', getPlayerName());
          window.location.href = '/lobby';
       }
    } catch (error) {
       console.log('could not create new game:', error);
    }
  };

  async function joinGame(hostName){
    // join an existing game, redirect to lobby
    console.log('joining game with hostname', hostName);
    localStorage.setItem('hostName', hostName);
    window.location.href = '/lobby';
  }

  function getPlayerName() {
    return localStorage.getItem('userName');
  }

  async function PopulateGameList(){
     try {
        const response = await fetch('/api/gameList');
        const gameListObject = await response.json();
        const gameList = Object.values(gameListObject);
        console.log(gameList);
        const gameTable = document.getElementById('game-list');
        if(gameList.length === 0){
           console.log('no open games');
           gameTable.style.display = 'none';
           document.getElementById('no-open-games').style.display = 'flex';
        }
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

  return (
    <main>
      <span id="player-name" className="second_smallest">{playerName}</span>
      <p className="second_smallest">Create a game or join an open game.</p>
      <table id="game-list">
        <thead>
          <tr className="game-row">
            <th id="game-row-el" style={{ fontWeight: 'bold' }}>Host Name</th>
            <th id="game-row-el" style={{ fontWeight: 'bold' }}>Status</th>
            <th id="game-row-el" style={{ fontStyle: 'italic' }}>Join a game</th>
          </tr>
        </thead>
        <tbody>
          {/* Your game list rows will be dynamically added here */}
        </tbody>
      </table>
      <div id="no-open-games" style={{ fontStyle: 'italic', marginBottom: '10px', display: 'none' }}>No open games.</div>
      <button className="btn btn-outline-secondary" onClick={newGame}>create a new game</button>
    </main>
  );
}
