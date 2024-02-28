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
const NEXT_ROUND_LUCK = 0.16;
const DOUBLES_LUCK = 0.33;
const MALLOW_SCALE = 10;
const MIN_MALLOW_IMG_SIZE = 50;

const roundNumberElement = document.querySelector('#round-label');
const secLeftElement = document.querySelector('.countdown-timer');
const mallowTotalElement = document.querySelector('.mallow-total');
const mallowCountImage = document.getElementById('mallow-count-image');

let round = 0;
let secondsLeft = SEC_PER_ROUND;
let mallowCount = 0;
let playerScore = 0; // IMPLEMENT A CLASS INSTEAD

// Play a certain number of rounds
playRounds();

async function playRounds(){
   document.getElementById('next-round-button').disabled = true;
   document.getElementById('snatch-button').disabled = false;
   document.getElementById('snatch-button').textContent = "Snatch now!";
   mallowCount = MALLOW_SCALE;
   round++;
   if(round==NUMBER_OF_ROUNDS){
      document.getElementById('next-round-button').textContent = "End Game";
   }
   if(round<=NUMBER_OF_ROUNDS){
      roundNumberElement.textContent = "Round " + round + " of " + NUMBER_OF_ROUNDS;
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
            let rollLuck = Math.random();
            console.log("Dice roll: " + rollLuck);
            if(rollLuck < NEXT_ROUND_LUCK){
               document.getElementById('last-round-action').textContent = "Mallows stolen by goblins. Round " + round + " ended.";
               endRound();
            } else if (rollLuck < DOUBLES_LUCK) {
               document.getElementById('last-round-action').textContent = "DOUBLE MALLOWS.";
               mallowCount *= 2;
               secondsLeft = SEC_PER_ROUND;
               countDown();
            } else {
               document.getElementById('last-round-action').textContent = "Added " + Math.round(rollLuck*MALLOW_SCALE) + " mallows.";
               mallowCount += Math.round(rollLuck*MALLOW_SCALE);
               secondsLeft = SEC_PER_ROUND;
               countDown();
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
}

function snatch_reset(playerid) {
   console.log('snatch reset');
}

function snatch(playerid) {
   // Disable the snatch button so it can't be clicked again.
   document.getElementById('snatch-button').disabled = true;
   document.getElementById('snatch-button').textContent = "Snatched!";

   // Set up which elements we're talking about
   console.log('snatch ' + playerid);
   const playerScoreboardElement = document.getElementById('.player1');
   const scoreImgElement = document.querySelector('.player-icon');
   const scoreElement = document.querySelector('.mallow-count');

   playerScore += mallowCount;
   scoreElement.textContent = playerScore + ' mallows';
}