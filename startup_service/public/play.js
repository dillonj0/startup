console.log('play.js');

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
   AddPlayerName();
})

function getPlayerName() {return localStorage.getItem('userName');}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~ ACTUAL GAMEPLAY ~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const NUMBER_OF_ROUNDS = 5;
const SEC_PER_ROUND = 3;
const MALLOW_SCALE = 10;
const MIN_MALLOW_IMG_SIZE = 50;
const BASE_ROLL_LUCK = 0.1;
const BASE_DOUBLES_LUCK = 0.33;
const PER_ROUND_VARIATION = 0.05;

const roundNumberElement = document.querySelector('#round-label');
const secLeftElement = document.querySelector('.countdown-timer');
const mallowTotalElement = document.querySelector('.mallow-total');
const mallowCountImage = document.getElementById('mallow-count-image');

let round = 0;
let roll = 1;
let secondsLeft = SEC_PER_ROUND;
let mallowCount = 0;
let playerScore = 0; // IMPLEMENT A CLASS INSTEAD
let next_round_luck = BASE_ROLL_LUCK;
let doubles_luck = BASE_DOUBLES_LUCK;

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
            if(rollLuck < next_round_luck){
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
   document.getElementById('next-round-button').disabled = false;
   if(document.getElementById('snatch-button').disabled === false){
      document.getElementById('snatch-button').disabled = true;
      document.getElementById('snatch-button').textContent = "😵";
   }
   mallowTotalElement.textContent = "0";
}

function endGame(){
   console.log('ending game...');
   // Make the gameplay elements disappear
   document.querySelector('.gameplay').style.display = "none";
   document.getElementById('next-round-button').style.display = "none";
   roundNumberElement.style.display = "none";
   document.getElementById('last-round-action').textContent = " ";

   // Make the final score elements appear
   const mainItems = document.querySelectorAll('.post-game-main')
   mainItems.forEach((item) => {
      item.style.display = "flex";
   });
   document.querySelector('#post-game-score').textContent = playerScore;

   updateScores();
}

function snatch_reset() {
   console.log('snatch reset');
   const playerIcons = document.querySelectorAll(".player-icon");
   playerIcons.forEach((icon) => {
      icon.src="android-chrome-192x192.png";
   });
}

function snatch(playerid) {
   // Disable the snatch button so it can't be clicked again.
   document.getElementById('snatch-button').disabled = true;
   document.getElementById('snatch-button').textContent = "Snatched!";

   // Set up which elements we're talking about
   console.log('snatch ' + playerid);
   const playerScoreboardElement = document.getElementById(playerid);
   const scoreImgElement = document.querySelector('.player-icon');
   const scoreElement = document.querySelector('.mallow-count');

   // Update score & score display
   playerScore += mallowCount;
   scoreElement.textContent = playerScore + ' mallows';
   // Grow mallow score size accordingly
   let sizeString = playerScore + 'px';
   scoreImgElement.style.height = sizeString;
   scoreImgElement.style.width = sizeString;
   document.querySelector(".player-icon").src="dark_mallow-192x192.png";
}

function randomText() {
   let key = Math.random();
   // console.log('random text key: '+ key);
   if(key < 0.2){return "Mallows stolen by goblins."}
   else if(key < 0.4){return "Mallows taken in for questioning."}
   else if(key < 0.6){return "Mallows eaten by monks."}
   else if(key < 0.8){return "Mallows destroyed by the passage of time."}
   else {return "Mallows vanished in a blaze of glory."}
}

async function updateScores() {
   console.log('updating score');
   let newScore = new Object({score: playerScore, username: getPlayerName()});
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