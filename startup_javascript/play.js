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

let round = 0;
let secondsLeft = SEC_PER_ROUND;
const roundNumberElement = document.querySelector('#round-label')
const secLeftElement = document.querySelector('.countdown-timer')



// Play a certain number of rounds
playRounds();

async function playRounds(){
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
   return new Promise((resolve,reject) => {
      if(secondsLeft>0){
         setTimeout( () => {
            secondsLeft--;
            secLeftElement.textContent = secondsLeft;
            countDown();
         }, 1000);
      }
      else{
         console.log("round " + round + " ended.")
      }
   });
}