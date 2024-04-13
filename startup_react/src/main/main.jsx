import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink from react-router-dom

export default function Main() {
  const [quote, setQuote] = useState('');
  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = () => {
    fetch('https://api.quotable.io/random')
      .then(response => response.json())
      .then(data => {
        setQuote(data);
      })
      .catch(error => {
        console.error('Error fetching quote:', error);
      });
  };

  const [username, setUsername] = useState('');
  useEffect(() => {
    const storedUsername = localStorage.getItem('userName');
    if(storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('userName');
    setUsername('');
  }

  const authenticated = () => {
    return !!username;
  }

  return (
    <>
      <main>
        <img alt="Mallow icon" width="50" src="android-chrome-192x192.png" style={{display: 'none'}} />
        {/* Determine which elements to display based off of whether you're logged in */}
        {authenticated() ? (
          <div className="logged-in-box">
            <p>Logged in as {username}</p>
            <div>
              <NavLink to = '/join'>
                <button className="btn btn-outline-success">Let's play!</button>
              </NavLink>
              <button className="btn btn-outline-secondary" onClick={logout}>Log out</button>
            </div>
          </div>
        ) : (
          <div className="login-box">
            <p>Log in to join a game.</p>
            <div className="input-group mb-3">
              <input className="form-control" type="text" id="userName" placeholder="username" />
            </div>
            <div className="input-group mb-3">
              <input className="form-control" type="password" id="userPassword" placeholder="password" />
            </div>
            <div>
              <button className="btn btn-outline-success" onClick={login}>Let's play!</button>
              <button className="btn btn-outline-secondary" onClick={createUser}>Create user</button>
            </div>
          </div>
        )}
      </main>
      <div id="quote">
        {quote && (
            <>
              <p className="quote">{quote.content}</p>
              <p className="author">{quote.author}</p>
            </>
          )}
      </div>
    </>
  ); 
}

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

async function login() {
  if (authenticated()) {
    window.location.href='join';
  }
  else if(usernameAndPasswordCheck()){
      await loginOrCreate(`/api/auth/login`);
      window.location.href='join';
  }
}


async function createUser() {
  if(usernameAndPasswordCheck()){
     await loginOrCreate(`/api/auth/create`);
     window.location.href='join';
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

function authenticated() {
  const username = localStorage.getItem("userName");
  if(username){
     return true;
  }
  return false;
}