import React, { useState, useEffect, useRef } from "react";

console.log('play.js');

// Adjust the webSocket protocol to what is being used for HTTP
const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

let roll = 0;
let nonHostPlayers = [];
let playable = true;
let secondsLeft = 0;
let nextLuck = 0.1;
let doublesLuck = 0.33;
let mallowCount = 0;
let playerScore = 0;
let roundNumber = 0;

const scoreboardImgScale = 0.5;

export function Play() {
  const secLeftElement = useRef(null);

  const NUMBER_OF_ROUNDS = 1;
  const SEC_PER_ROUND = 3;
  const MALLOW_SCALE = 10;
  const MIN_MALLOW_IMG_SIZE = 50;
  const BASE_ROLL_LUCK = 0.1;
  const BASE_DOUBLES_LUCK = 0.33;
  const PER_ROUND_VARIATION = 0.05;

  // const [roundNumber, setRoundNumber] = useState(0);
  const [playerName, setPlayerName] = useState('');
  // const [score, setScore] = useState('#');
  // const [secLeft, setSecLeft] = useState(0);
  const [mallowCounter, setMallowCounter] = useState(0);
  // const [nextLuck, setNextLuck] = useState(BASE_ROLL_LUCK);
  // const [doublesLuck, setDoublesLuck] = useState(BASE_DOUBLES_LUCK);
  const [snatchDisabled, setSnatchDisabled] = useState(false);
  const [nextRoundDisabled, setNextRoundDisabled] = useState(false);

  function setLuck(roll_num){
    console.log(`setting luck, roll #${roll_num}`);
    const next = BASE_ROLL_LUCK + Math.random()*PER_ROUND_VARIATION*roll_num;
    const doubles = next + (1-next)*Math.random();
    // setNextLuck(next);
    // setDoublesLuck(doubles);
    nextLuck = next;
    doublesLuck = doubles;

    console.log(`---> Next: ${next}, Doubles: ${doubles}`);
  }

  async function playRounds(){
    snatch_reset();
    roll = 1;
    setNextRoundDisabled(true);
    setSnatchDisabled(false);

    document.getElementById('snatch-button').textContent = "Snatch now!";
    mallowCount = MALLOW_SCALE;
    setMallowCounter(mallowCount);
    roundNumber += 1;
    console.log(`starting round ${roundNumber} of ${NUMBER_OF_ROUNDS}`);
    if(roundNumber==NUMBER_OF_ROUNDS){
      document.getElementById('next-round-button').textContent = "End Game";
    }
    if(roundNumber<=NUMBER_OF_ROUNDS){
      notifyNonHost('round-start');
      // Reset the luck values to their initial quantities.
      nextLuck = BASE_ROLL_LUCK;
      doublesLuck = BASE_DOUBLES_LUCK;
      
      secondsLeft = SEC_PER_ROUND;
      secLeftElement.current.textContent = secondsLeft;

      console.log("round " + roundNumber);
      try{await countDown();}
      catch(error) {console.error('countdown failed:', error);}
      finally{
        console.log('playrounds finally');
        // Set playable back to true for the next round
        playable = true;
      }
    } else {
      endGame();
    }
 }


 async function countDown() {
  // Count down from three. Either increment the mallow count, or end the round
  //    as determined by a random dice roll.
     return new Promise((resolve,reject) => {

      secLeftElement.current.textContent = secondsLeft;   
      if(secondsLeft>0){
          setTimeout( () => {
            // setSecLeft(secLeft - 1);
            secondsLeft--;
            countDown();
          }, 1000);
      }
      else{
          setTimeout( () => {
            roll++;

            let rollLuck = Math.random();
            console.log("Dice roll: " + rollLuck);
            if(rollLuck < nextLuck || everyoneHasSnatched()){
              console.log(`***end round ${roundNumber}***`)
              document.getElementById('last-round-action').textContent = randomText() + " Round " + roundNumber + " ended.";
              endRound();
              if(roundNumber === NUMBER_OF_ROUNDS){
                endGame();
              }
            } else if (rollLuck < doublesLuck) {
              document.getElementById('last-round-action').textContent = "DOUBLE MALLOWS.";
              mallowCount *= 2;

              secondsLeft = SEC_PER_ROUND;
              secLeftElement.current.textContent = secondsLeft;
              
              countDown();
              setLuck(roll);
            } else {
              const added = Math.round(rollLuck*MALLOW_SCALE*roll);
              document.getElementById('last-round-action').textContent = "Added " + added + " mallows.";
              mallowCount += added;

              secondsLeft = SEC_PER_ROUND;
              secLeftElement.current.textContent = secondsLeft;

              countDown();
              setLuck(roll);
            }
            setMallowCounter(mallowCount);
          }, 1000);
        }
     });
  }

  function quit() {
    endGame(false);
    alert('Redirecting to main');
    setTimeout(() => {
       window.location.href = 'join.html';
    }, 1000);
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
            <div ref={secLeftElement} className="countdown-timer">#</div>
            <div>seconds left!</div>
          </div>
          <img id="mallow-count-image" alt="Mallow icon" width={mallowCount} height={mallowCount} src="android-chrome-192x192.png" />
          <div>
            <div>Mallows:</div>
            <div className="mallow-total">{mallowCounter}</div>
          </div>
          <div>
            <button className="btn btn-success" id="snatch-button" onClick={() => snatch(getPlayerName())} disabled = {snatchDisabled}>Snatch now!</button>
          </div>
        </div>
      </main>
      <div id='last-round-action'></div>
      <button className="btn btn-outline-secondary" id="next-round-button" disabled={nextRoundDisabled} onClick={playRounds}>Next round</button>
      <scoreboard id = "scoreboard-board">
         <h3 className="ScoreboardLabel">Scoreboard</h3>
         <div className="Scoreboard"></div>
         <div className="quit-button">
            <button onClick={quit} className="btn btn-outline-secondary">Quit game</button>
         </div>
      </scoreboard>
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

function addNonHost(name) {
  const newPlayer = {userName: name, score: 0, snatched: false};
  nonHostPlayers.push(newPlayer);
  createPlayerScoreBoard(name);
  console.log('player', name, 'joined the game');
}

function createPlayerScoreBoard(name){
  // Create the elements for the player scoreboard
  const newScoreboard = document.createElement('div');
  newScoreboard.classList.add('player-scoreboard');

  const playerNameEl = document.createElement('div');
  playerNameEl.classList.add('player-name');
  playerNameEl.textContent = name;

  const playerImgEl = document.createElement('img');
  playerImgEl.src = 'android-chrome-192x192.png'; // Set the default icon source
  const iconID = name + '-icon';
  playerImgEl.classList.add('player-icon');
  playerImgEl.id = iconID;
  playerImgEl.style.width = '0';
  playerImgEl.style.height = '0';

  const playerScoreEl = document.createElement('div');
  playerScoreEl.classList.add('mallow-count');
  playerScoreEl.textContent = '0 mallows'; // Set the initial score
  playerScoreEl.id = name;

  newScoreboard.appendChild(playerNameEl);
  newScoreboard.appendChild(playerScoreEl);
  newScoreboard.appendChild(playerImgEl);

  const container = document.querySelector('.Scoreboard');
  container.appendChild(newScoreboard);
}

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

function everyoneHasSnatched () {
  if (document.getElementById('snatch-button').disabled === false){
     return false;
  }

  // Check if all non-host players have snatched
  for (let i = 0; i < nonHostPlayers.length; i++) {
     if (!nonHostPlayers[i].snatched) {
         return false;
     }
 }

 // Return true if all players have snatched
 console.log('all have snatched. End round.');
 return true;
}

function randomText() {
  // if all players have snatched, say that instead of random explanation
  if (everyoneHasSnatched()) {
     return "All players have snatched."
  }

  let key = Math.random();
  // console.log('random text key: '+ key);
  if(key < 0.2){return "Mallows stolen by goblins."}
  else if(key < 0.4){return "Mallows taken in for questioning."}
  else if(key < 0.6){return "Mallows eaten by monks."}
  else if(key < 0.8){return "Mallows destroyed by the passage of time."}
  else {return "Mallows vanished in a blaze of glory."}
}

function endRound(){
  const mallowTotalElement = document.querySelector('.mallow-total');
  const mallowCountImage = document.getElementById('mallow-count-image');
  notifyNonHost('round-end');
  document.getElementById('next-round-button').disabled = false;
  if(document.getElementById('snatch-button').disabled === false){
     document.getElementById('snatch-button').disabled = true;
     document.getElementById('snatch-button').textContent = "😵";
  }
  mallowTotalElement.textContent = "0";
  mallowCountImage.style.height = 0;
  mallowCountImage.style.width = 0;
}

function snatch(playerid) {
  console.log('snatch ' + playerid);
  if (!playable){return;}

  // Set up which elements we're talking about
  const imgID = playerid + '-icon'
  const scoreImgElement = document.getElementById(imgID);
  const scoreElement = document.getElementById(playerid);
  let sizeString;

  // Disable the snatch button so it can't be clicked again.
  if(playerid === getPlayerName()){
     document.getElementById('snatch-button').disabled = true;
     document.getElementById('snatch-button').textContent = "Snatched!";
     
     // Update score & score display
     playerScore += mallowCount;
     scoreElement.textContent = playerScore + ' mallows';
     sizeString = (playerScore / scoreboardImgScale) + 'px';
  } else {
     const player = nonHostPlayers.find(player => player.userName === playerid);
     if (player) {
        player.score += mallowCount;
        scoreElement.textContent = player.score + ' mallows';
        sizeString = (player.score / scoreboardImgScale) + 'px';
        player.snatched = true;
     } else {
        console.log('Cannot snatch', playerid, ': not found in player list.');
        addNonHost(playerid);
        snatch(playerid);
        return;
     }
  }
  
  // Grow mallow score size accordingly
  scoreImgElement.style.height = sizeString;
  scoreImgElement.style.width = sizeString;
  scoreImgElement.src="dark_mallow-192x192.png";
}

document.addEventListener('DOMContentLoaded', function(){
  createPlayerScoreBoard(getPlayerName());
  AddPlayerName();
})

async function endGame(sendScores = true){
  console.log('ending game...');
  notifyNonHost('finished');
  playable = false;
  // Make the gameplay elements disappear
  document.querySelector('.gameplay').style.display = "none";
  document.querySelector('.luck-bar').style.display = "none";
  document.getElementById('next-round-button').style.display = "none";
  roundNumberElement.style.display = "none";
  document.getElementById('player-name').style.display = 'none';
  document.getElementById('last-round-action').textContent = " ";

  if(sendScores){
     // Make the final score elements appear
     const mainItems = document.querySelectorAll('.post-game-main')
     mainItems.forEach((item) => {
        item.style.display = "flex";
     });

     // Find the player with the highest score
     let highestScorer = { userName: getPlayerName(), score: playerScore };
     nonHostPlayers.forEach(player => {
        if (player.score > highestScorer.score) {
           highestScorer = { userName: player.userName, score: player.score };
        }
     });
     document.querySelector('#post-game-username').textContent = highestScorer.userName;
     document.querySelector('#post-game-score').textContent = highestScorer.score;

     updateScores(playerScore, getPlayerName());
     nonHostPlayers.forEach(player => {
        updateScores(player.score, player.userName);
     })
  }
  // Let the main system know that the game is over
  try {
     const host = getPlayerName();
     response = await fetch('/api/endGame', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({hostName: host})
     });
  } catch (error) {
     console.log('error closing game:', error);
     // alert('There was an error closing the game.');
  }
}