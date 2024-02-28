// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~ PAGE SETUP ~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function AddPlayerName() {
   console.log("starting to set player name...")
   const playerNameElement = document.querySelector('#player-name');
   let usernameString = getPlayerName();
   playerNameElement.textContent = usernameString;
   console.log("set player name");
}
document.addEventListener('DOMContentLoaded', function(){
   AddPlayerName();
})

function getPlayerName() {return localStorage.getItem('userName');}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~ ACTUAL GAMEPLAY ~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const NUMBER_OF_ROUNDS = 15;
const SEC_PER_ROUND = 3;
const NEXT_ROUND_LUCK = 0.16;
const DOUBLES_LUCK = 0.33;
const MALLOW_SCALE = 10;
const MIN_MALLOW_IMG_SIZE = 50;

let round = 0;
let secondsLeft = SEC_PER_ROUND;
let mallowCount;
const roundNumberElement = document.querySelector('#round-label');
const secLeftElement = document.querySelector('.countdown-timer');
const mallowTotalElement = document.querySelector('.mallow-total');
const mallowCountImage = document.getElementById('mallow-count-image');

// Play a certain number of rounds
playRounds();

async function playRounds(){
   document.getElementById('next-round-button').disabled = true;
   document.getElementById('snatch-button').disabled = false;
   document.getElementById('snatch-button').textContent = "Snatch now!"
   mallowCount = MALLOW_SCALE;
   round++;
   if(round<NUMBER_OF_ROUNDS){
      roundNumberElement.textContent = "Round " + round + " of " + NUMBER_OF_ROUNDS;
      secondsLeft = SEC_PER_ROUND;
      secLeftElement.textContent = secondsLeft;
   }
   console.log("round " + round);
   try{await countDown();}
   catch{console.log('countdown failed.')}
   finally{
      print('playrounds finally')
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
               console.log("round " + round + " ended.")
               endRound();
            } else if (rollLuck < DOUBLES_LUCK) {
               console.log("DOUBLE MALLOWS.");
               mallowCount *= 2;
               secondsLeft = SEC_PER_ROUND;
               countDown();
            } else {
               console.log("Added " + Math.round(rollLuck*MALLOW_SCALE) + " mallows.");
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
   document.getElementById('snatch-button').disabled = true;
   document.getElementById('snatch-button').textContent = "😵";
   mallowTotalElement.textContent = "SNATCHED!";
}