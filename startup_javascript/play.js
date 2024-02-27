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

localStorage.setItem('ROUND_NUMBER', 0);
let secondsLeft = SEC_PER_ROUND;
const roundNumberElement = document.querySelector('#round-label')
const secLeftElement = document.querySelector('.countdown-timer')

// Play a certain number of rounds
for(let i = 1; i <= NUMBER_OF_ROUNDS; i++) {
   roundNumberElement.textContent = "ROUND " + i + " of " + NUMBER_OF_ROUNDS;
   // Each round, count down the timer and adjust scores;
   // while (localStorage.getItem('SECONDS_LEFT') > 0) {
   //    console.log(localStorage.getItem('SECONDS_LEFT'));
   //    secLeftElement.textContent = localStorage.getItem('SECONDS_LEFT');
   //    setTimeout( () => {
   //       localStorage.setItem('SECONDS_LEFT', localStorage.getItem('SECONDS_LEFT') - 1);
   //    }, 1000);
   // }
}
