import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink from react-router-dom

export function Lobby() {
  const [isHost, setIsHost] = useState(false);
  useEffect(() => {
    const storedHostName = localStorage.getItem('hostName');
    const storedPlayerName = localStorage.getItem('userName');
    if (storedHostName && storedPlayerName === storedHostName) {
      setIsHost(true);
    } else {
      setIsHost(false);
    }
  }, []);

  const [hostName, setHostName] = useState('');
  useEffect(() => {
    const storedHostName = localStorage.getItem('hostName');
    if(storedHostName){
      setHostName(storedHostName);
    }
  }, []);

  const [playerName, setPlayerName] = useState('');
  useEffect(() => {
    const storedPlayerName = localStorage.getItem('userName');
    if(storedPlayerName){
      setPlayerName(storedPlayerName);
    }
  }, []);

  return (
    <main>
      <span id="player-name">{playerName}</span>
      <div id="host-name" style={{ fontStyle: 'italic' }}>{hostName} is the host.</div>
      {isHost ? (
        <button className="btn btn-success" id="start-button" onClick={play}>Start the game</button>
      ) : (
        <div id='wait' style={{ fontStyle: 'italic' }}>Waiting for the host to start the game...</div>
      )}
    </main>
  );
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
        socket.close;
        window.location.href = '/play';
     } catch (error) {
        console.error('error starting game:', error);
        // alert('There was an error starting the game.');
     }
  } else {
     setTimeout ( () => {
      socket.close;
      window.location.href = '/nonHost';
     }, 10);
  }
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