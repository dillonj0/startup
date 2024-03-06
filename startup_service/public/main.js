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