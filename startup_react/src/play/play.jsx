import React, { useState, useEffect } from "react";

console.log('play.js');

// Adjust the webSocket protocol to what is being used for HTTP
const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

let roll = 0;
let nonHostPlayers = [];
let playable = true;

export function Play() {
  const NUMBER_OF_ROUNDS = 15;
  const SEC_PER_ROUND = 3;
  const MALLOW_SCALE = 10;
  const MIN_MALLOW_IMG_SIZE = 50;
  const BASE_ROLL_LUCK = 0.1;
  const BASE_DOUBLES_LUCK = 0.33;
  const PER_ROUND_VARIATION = 0.05;
  const scoreboardImgScale = 2;

  const [roundNumber, setRoundNumber] = useState(0);
  const [playerName, setPlayerName] = useState('');
  // const [score, setScore] = useState('#');
  const [secLeft, setSecLeft] = useState(0);
  const [mallowCount, setMallowCount] = useState(0);
  const [nextLuck, setNextLuck] = useState(BASE_ROLL_LUCK);
  const [doublesLuck, setDoublesLuck] = useState(BASE_DOUBLES_LUCK);
  const [snatchDisabled, setSnatchDisabled] = useState(false);
  const [nextRoundDisabled, setNextRoundDisabled] = useState(false);

  function setLuck(roll_num){
    console.log(`setting luck, roll #${roll_num}`);
    const next = BASE_ROLL_LUCK + Math.random()*PER_ROUND_VARIATION*roll_num;
    const doubles = next + (1-next)*Math.random();
    setNextLuck(next);
    setDoublesLuck(doubles);
    console.log(`---> Next: ${next}, Doubles: ${doubles}`);
  }

  async function playRounds(){
    snatch_reset();
    roll = 1;
    setNextRoundDisabled(true);
    setSnatchDisabled(false);

    document.getElementById('snatch-button').textContent = "Snatch now!";
    setMallowCount(MALLOW_SCALE);
    setRoundNumber(roundNumber + 1);
    console.log(`starting round ${roundNumber} of ${NUMBER_OF_ROUNDS}`);
    if(roundNumber==NUMBER_OF_ROUNDS){
       document.getElementById('next-round-button').textContent = "End Game";
    }
    if(roundNumber<=NUMBER_OF_ROUNDS){
       notifyNonHost('round-start');
       // Reset the luck values to their initial quantities.
       setNextLuck(BASE_ROLL_LUCK);
       setDoublesLuck(BASE_DOUBLES_LUCK);
       updateLuckBar(next_round_luck,doubles_luck);
       secondsLeft = SEC_PER_ROUND;
       secLeftElement.textContent = secondsLeft;
       console.log("round " + round);
       try{await countDown();}
       catch{console.log('countdown failed.');}
       finally{
          console.log('playrounds finally');
       }
    } else {
       endGame();
    }
 }

  function quit() {
    return;
  }

  return (
    <>
      <main>
        <span id="player-name">{playerName}</span>
        <div className='post-game-main'>Winner:</div>
        <div className='post-game-main' id="post-game-username" style={{ fontWeight: 'bold' }}></div>
        <div className='post-game-main' id="post-game-score"></div>
        <h1 id="round-label">ROUND {roundNumber} of {NUMBER_OF_ROUNDS}</h1>
        <LuckBar nextLuck = {nextLuck} doublesLuck = {doublesLuck} />
        <div className="gameplay">
          <div>
            <div className="countdown-timer">{secLeft}</div>
            <div>seconds left!</div>
          </div>
          <img id="mallow-count-image" alt="Mallow icon" width="100" height="100" src="android-chrome-192x192.png" />
          <div>
            <div>Mallows:</div>
            <div className="mallow-total">{mallowCount}</div>
          </div>
          <div>
            <button className="btn btn-success" id="snatch-button" onClick={() => snatch(getPlayerName())} disabled = {snatchDisabled}>Snatch now!</button>
          </div>
        </div>
      </main>
      <div id='last-round-action'></div>
      <button className="btn btn-outline-secondary" id="next-round-button" disabled={nextRoundDisabled} onClick={playRounds}>Next round</button>
      <Scoreboard />
    </>
  );
}

const LuckBar = ({ nextLuck, doublesLuck }) => {
  const fadeMargin = 0.05;

  // Calculate the edge values for the gradient
  const failEdge = `${(nextLuck * 100).toFixed(2)}%`;
  const failAddEdge = `${((nextLuck + fadeMargin) * 100).toFixed(2)}%`;
  const addEdge2 = `${((1 - (doublesLuck - nextLuck)) * 100).toFixed(2)}%`;
  const addDoubleEdge = `${(((1 - (doublesLuck - nextLuck)) + fadeMargin) * 100).toFixed(2)}%`;

  return (
    <div className="luck-bar" style={{ background: `linear-gradient(to right, red ${failEdge}, yellow ${failAddEdge}, yellow ${addEdge2}, green ${addDoubleEdge}, green 0)` }}></div>
  );
};


// PlayerScoreboard component
function PlayerScoreboard({ name }) {
  // Initial state for score
  const [score, setScore] = useState(0);

  // Function to update the score
  const updateScore = (newScore) => {
    setScore(newScore);
  };

  return (
    <div className="player-scoreboard">
      <div className="player-name">{name}</div>
      <div className="mallow-count">{score} mallows</div>
      <img src="/android-chrome-192x192.png" alt="Player icon" className="player-icon" style={{ width: {score}, height: {score} }} />
    </div>
  );
}

// Scoreboard component
function Scoreboard() {
  // State to hold the list of players
  const [players, setPlayers] = useState([{ name: getPlayerName(), score: 0 }]);

  // Function to add a new player
  const addPlayer = (name) => {
    // Update the list of players
    setPlayers([...players, { name, score: 0 }]);
  };

  return (
    <div className="Scoreboard">
      <h3 className="ScoreboardLabel">Scoreboard</h3>
      <div className="Scoreboard">
        {/* Render player scoreboards */}
        {players.map((player, index) => (
          <PlayerScoreboard key={index} name={player.name} score={player.score} />
        ))}
      </div>
      <div className="quit-button">
        <button className="btn btn-outline-secondary">Quit game</button>
      </div>
    </div>
  );
}

function getPlayerName() {
  const name = localStorage.getItem('userName');
  if(name) {
    return name;
  } else {
    return false;
  }
}

function snatch_reset() {
  console.log('snatch reset');
  const playerIcons = document.querySelectorAll(".player-icon");
  playerIcons.forEach((icon) => {
     icon.src="android-chrome-192x192.png";
  });
  nonHostPlayers.forEach((player) => {
     player.snatched = false;
  });
}

// ====== WEBSOCKET STUFF =========================
// Display that we have opened the webSocket
// Display that we have opened the webSocket
socket.onopen = (event) => {
  console.log('websocket connection opened');
};

socket.onmessage = function(event) {
   console.log('received from server:', event.data);
   const message = JSON.parse(event.data);
   const host = message.hostName;
   const command = message.command;
   const playerID = message.userName;
  if(host === getPlayerName()){
     // The player name should be the host name because only the host ends 
     //    up here.      
     if(command === 'snatch'){
        snatch(playerID);
     } else if (command === 'join'){
        // run these two lines if there's not already a player with this ID:
        if (!nonHostPlayers.find(player => player.userName === playerID)) {
           addNonHost(playerID);
           console.log(playerID, 'joined the game');
        }
     }
  }
};

socket.onclose = (event) => {
  endGame();
  alert('lost connection to server; please check connection');
};

function notifyNonHost(action) {
  const hostName = getPlayerName();
  const command = action;
  const userName = getPlayerName();
  const message = {
      hostName: hostName,
      command: command,
      userName: userName
  };

  // Check if the WebSocket connection is open
  if (socket.readyState === WebSocket.OPEN) {
      // Send the message to the WebSocket server
      socket.send(JSON.stringify(message));
  } else {
      // Handle the case where the WebSocket connection is not open
      console.log('WebSocket connection is not open.');
  }
}