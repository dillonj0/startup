function login() {
   const usernameElement = document.querySelector('#username');

   localStorage.setItem('userName', usernameElement.value);
   console.log(localStorage.getItem('userName'));

   if(document.querySelector('#password').value !== '') {
      console.log("redirecting to join.html");
      window.location.href='join.html';
      
   }
   else {
      console.log('User did not provide password.');
      alert("You must provide a username and password to play.");
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