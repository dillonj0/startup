import React, { useState, useEffect } from "react";

export function NonHost() {
  const [playerName, setPlayerName] = useState('');
  useEffect(() => {
    const storedUsername = localStorage.getItem('userName');
    if(storedUsername) {
      setPlayerName(storedUsername); // Call PopulateGameList when component mounts
    } else {
      socket.close;
      window.location.href='/';
      console.log('NOT AUTHENTICATED');
    }
  }, []);

  return (
    <main>
      <span id="player-name">{playerName}</span>
      <button className="btn btn-success" id="snatch-button" onClick={snatch}>Snatch now!</button>
    </main>
  );
}

function getPlayerName() {
  return localStorage.getItem('userName');
}

function getHostName() {
  return localStorage.getItem('hostName');
}

function snatch() {
  const playerid = getPlayerName();

  notifyWebsocket();

  // Disable the snatch button so it can't be clicked again.
  document.getElementById('snatch-button').disabled = true;
  document.getElementById('snatch-button').textContent = "Snatched!";

  // Set up which elements we're talking about
  console.log('snatch ' + playerid);
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
let socket;
if(socket){
  socket.close;
}
socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

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
          command: command,
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
        socket.close;
        window.location.href = '/join';
      }
  }
};

socket.onclose = (event) => {
  if(alert('lost connection to server; please check connection')){
    window.location.href='/join';
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