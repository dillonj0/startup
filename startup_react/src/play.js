console.log('play.js');

// Adjust the webSocket protocol to what is being used for HTTP
const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~ PAGE SETUP ~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function AddPlayerName() {
   console.log("starting to set player name...")
   const playerNameElement = document.querySelector('#player-name');
   const playerNameScoreboardElement = document.querySelector('.player-name');
   let usernameString = getPlayerName();
   playerNameElement.textContent = usernameString;
   playerNameScoreboardElement.textContent = usernameString;
   console.log("set player name");
}
document.addEventListener('DOMContentLoaded', function(){
   createPlayerScoreBoard(getPlayerName());
   AddPlayerName();
})

function getPlayerName() {return localStorage.getItem('userName');}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~ ACTUAL GAMEPLAY ~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const NUMBER_OF_ROUNDS = 15;
const SEC_PER_ROUND = 3;
const MALLOW_SCALE = 10;
const MIN_MALLOW_IMG_SIZE = 50;
const BASE_ROLL_LUCK = 0.1;
const BASE_DOUBLES_LUCK = 0.33;
const PER_ROUND_VARIATION = 0.05;
const scoreboardImgScale = 2;

const roundNumberElement = document.querySelector('#round-label');
const secLeftElement = document.querySelector('.countdown-timer');
const mallowTotalElement = document.querySelector('.mallow-total');
const mallowCountImage = document.getElementById('mallow-count-image');

let round = 0;
let roll = 1;
let secondsLeft = SEC_PER_ROUND;
let mallowCount = 0;
let playerScore = 0; // IMPLEMENT A CLASS INSTEAD
let nonHostPlayers = [];
let next_round_luck = BASE_ROLL_LUCK;
let doubles_luck = BASE_DOUBLES_LUCK;
let playable = true;

// Play a certain number of rounds
updateLuckBar(next_round_luck,doubles_luck);
playRounds();

async function playRounds(){
   snatch_reset();
   roll = 1;
   document.getElementById('next-round-button').disabled = true;
   document.getElementById('snatch-button').disabled = false;
   document.getElementById('snatch-button').textContent = "Snatch now!";
   mallowCount = MALLOW_SCALE;
   round++;
   console.log(`starting round ${round} of ${NUMBER_OF_ROUNDS}`);
   if(round==NUMBER_OF_ROUNDS){
      document.getElementById('next-round-button').textContent = "End Game";
   }
   if(round<=NUMBER_OF_ROUNDS){
      notifyNonHost('round-start');
      roundNumberElement.textContent = "Round " + round + " of " + NUMBER_OF_ROUNDS;
      next_round_luck=BASE_ROLL_LUCK;
      doubles_luck=BASE_DOUBLES_LUCK;
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

async function countDown() {
// Count down from three. Either increment the mallow count, or end the round
//    as determined by a random dice roll.
   return new Promise((resolve,reject) => {
      // Set mallow count, timer, and mallow image size      
      mallowTotalElement.textContent = mallowCount;
      let sizeString = MIN_MALLOW_IMG_SIZE + mallowCount + 'px';
      mallowCountImage.style.height = sizeString;
      mallowCountImage.style.width = sizeString;
      secLeftElement.textContent = secondsLeft;
      
      if(secondsLeft>0){
         setTimeout( () => {
            secondsLeft--;
            secLeftElement.textContent = secondsLeft;
            countDown();
         }, 1000);
      }
      else{
         setTimeout( () => {
            roll++;

            let rollLuck = Math.random();
            console.log("Dice roll: " + rollLuck);
            if(rollLuck < next_round_luck || everyoneHasSnatched()){
               console.log(`***end round ${round}***`)
               document.getElementById('last-round-action').textContent = randomText() + " Round " + round + " ended.";
               endRound();
            } else if (rollLuck < doubles_luck) {
               document.getElementById('last-round-action').textContent = "DOUBLE MALLOWS.";
               mallowCount *= 2;
               secondsLeft = SEC_PER_ROUND;
               countDown();
               setLuck(roll);
               updateLuckBar(next_round_luck,doubles_luck);
            } else {
               document.getElementById('last-round-action').textContent = "Added " + Math.round(rollLuck*MALLOW_SCALE) + " mallows.";
               mallowCount += Math.round(rollLuck*MALLOW_SCALE);
               secondsLeft = SEC_PER_ROUND;
               countDown();
               setLuck(roll);
               updateLuckBar(next_round_luck,doubles_luck);
            }
         }, 1000);
      }
   });
}

function endRound(){
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

async function endGame(){
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

async function updateScores(score, name) {
   console.log('sending score for', name);
   let newScore = new Object({score: score, username: name});
   try {
      // attempt to get the top scores from the server
      const response = await fetch('/api/score', {
         method: 'POST',
         headers: {'content-type': 'application/json'},
         body: JSON.stringify(newScore)
      });
      const scores = await response.json();
      localStorage.setItem('scoreArray', JSON.stringify(scores));
      console.log('score sent to server');
   } catch {
      console.log(`could not connect to score server: using local storage.`);
      // Update the final score in localStorage
      if(localStorage.getItem('scoreArray')){
         let scoreArray = JSON.parse(localStorage.getItem('scoreArray'));
         scoreArray.push(newScore);
         let scoreString = JSON.stringify(scoreArray);
         localStorage.setItem('scoreArray', scoreString);
      } else {
         let scoreString = JSON.stringify([newScore]);
         localStorage.setItem('scoreArray', scoreString);
      }
   }
}

// Change the luck values from round to round so that the players have something
//    to gamble off of.
function setLuck(roll_num){
   console.log(`setting luck, roll #${roll_num}`);
   next_round_luck = BASE_ROLL_LUCK + Math.random()*PER_ROUND_VARIATION*roll_num;
   doubles_luck = next_round_luck+(1-next_round_luck)*Math.random()
   console.log(`---> Next: ${next_round_luck}, Doubles: ${doubles_luck}`);
}

function updateLuckBar(failLuck, doubleLuck) {
   const fadeMargin = 0.05;
   const luckElement = document.querySelector(".luck-bar");

   console.log('updating luck bar colors...');

   // Calculate the edge values for the gradient
   const failEdge = `${(failLuck * 100).toFixed(2)}%`;
   const failAddEdge = `${((failLuck + fadeMargin) * 100).toFixed(2)}%`;
   const addEdge2 = `${((1-(doubleLuck-failLuck)) * 100).toFixed(2)}%`;
   const addDoubleEdge = `${(((1-(doubleLuck-failLuck)) + fadeMargin) * 100).toFixed(2)}%`;

   // Update the size of the luck bar
   luckElement.style.background=`linear-gradient(to right, red ${failEdge}, yellow ${failAddEdge}, yellow ${addEdge2},green ${addDoubleEdge},green 0)`;
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
   newScoreboard.appendChild(playerImgEl);
   newScoreboard.appendChild(playerScoreEl);

   const container = document.querySelector('.Scoreboard');
   container.appendChild(newScoreboard);
}

function quit(){
   endGame();
   alert('Redirecting to main');
   setTimeout(() => {
      window.location.href = 'join.html';
   }, 1000);
}