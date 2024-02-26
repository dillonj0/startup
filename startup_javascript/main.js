function login() {
   const usernameElement = document.querySelector('#username')

   localStorage.setItem('userName', usernameElement.value)
   console.log(localStorage.getItem('userName'))

   if(document.querySelector('#password').value) {
      window.location.href='join.html';
   }
   else {
      console.log('User did not provide password.')
   }
}