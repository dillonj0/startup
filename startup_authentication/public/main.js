(async () => {
   // simon code uses a function like this to display the username
   //    if there's a previously stored value, rather than making the
   //    user log back in every time they go to the home page
   const username = localStorage.getItem('userName');
   if (username) {
      console.log('user is already logged in as' + username);

      // TODO: fix this so the user doesn't have to log in again

   }
})();

function usernameAndPasswordCheck(){
   if(document.querySelector('#userPassword').value !== '' &&
      document.querySelector('#userName').value !== '') {
      return true;
   }
   else {
      console.log('User did not provide username and/or password.');
      alert("You must provide a username and password.");
      return false;
   }
}

async function login() {
   if(usernameAndPasswordCheck()){
      loginOrCreate(`/api/auth/login`)
   }
}

async function createUser() {
   if(usernameAndPasswordCheck()){
      loginOrCreate(`/api/auth/createUser`)
   }
}

async function loginOrCreate(endpoint) {
   // send the username and password to the server for verification
   const username = document.querySelector('#userName')?.value;
   const password = document.querySelector('#userPassword')?.value;
   const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({ username: username, password: password }),
      headers: {
         'Content-type': 'application/json; charset=UTF-8',
      },
   });

   if (response.ok) {
      localStorage.setItem('userName', username);
      console.log('logged in as' + username);
      window.location.href='join.html';
   } else {
      const body = await response.json();
      
   }
}

function displayQuote(data) {
   fetch('https://api.quotable.io/random')
      .then((response) => response.json())
      .then((data) => {
         const containerEl = document.querySelector('#quote');

         const quoteEl = document.createElement('p');
         quoteEl.classList.add('quote');
         const authorEl = document.createElement('p');
         authorEl.classList.add('author');

         quoteEl.textContent = data.content;
         authorEl.textContent = data.author;

         containerEl.appendChild(quoteEl);
         containerEl.appendChild(authorEl);
      });
}

displayQuote();