(async () => {
   // simon code uses a function like this to display the username
   //    if there's a previously stored value, rather than making the
   //    user log back in every time they go to the home page
   const username = localStorage.getItem('userName');
   if (username) {
      console.log('user is already logged in as ' + username);
      document.getElementById('userName').value = username;
   }
})();

function usernameAndPasswordCheck(){
   if(document.querySelector('#userPassword').value !== '' &&
      document.querySelector('#userName').value !== '') {
      const alphanumericRegex = /^[a-zA-Z0-9]+$/;
      if(alphanumericRegex.test(document.querySelector('#userName').value)){
         // Make sure the username isn't malicious code: alphanumeric only
         return true;
      }
      console.log('Username contains invalid characters.')
      alert('Usernames can contain only alphanumeric characters. (Letters and numbers only.)')
      return false;
   }
   else {
      console.log('User did not provide username and/or password.');
      alert("You must provide a username and password.");
      return false;
   }
}

function logout() {
   localStorage.removeItem('userName');
   // updateAuthenticationElements();
   window.location.href = 'index.html';
}

async function login() {
   if (authenticated()) {
      window.location.href='join.html';
   }
   else if(usernameAndPasswordCheck()){
      await loginOrCreate(`/api/auth/login`);
      window.location.href='join.html';
   }
}

async function createUser() {
   if(usernameAndPasswordCheck()){
      await loginOrCreate(`/api/auth/create`);
      window.location.href='instructions.html';
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
      console.log('logged in as ' + username);
   } else {
      alert('Please verify your username and password, or create a new account. If you are attempting to make a new account, your username may already be in use.');
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

function authenticated() {
   username = localStorage.getItem("userName");
   if(username){
      return true;
   }
   return false;
}

function updateAuthenticationElements(){
   if(authenticated()){
      console.log('logged in as ' + localStorage.getItem('userName'));
      document.querySelector('.logged-in-box').style.display = 'flex';
      document.querySelector('.login-box').style.display = 'none';
      document.getElementById('player-name').textContent = localStorage.getItem("userName");
   } else {
      console.log('not logged in');
      document.querySelector('.login-box').style.display = 'flex';
      document.querySelector('.logged-in-box').style.display = 'none';
      document.getElementById('player-name').textContent = '';
   }
}

displayQuote();
updateAuthenticationElements();