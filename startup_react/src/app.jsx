import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './app.css'

export default function App() {
   return (
      <div class='app'>
      <header>
         <h1><img alt="Mallow icon" width="50" src="android-chrome-192x192.png"/> Mallow Snatchers</h1>
         <nav>
            <menu>
               <li class="nav_item"><a href="index.html">Home</a></li>
               <li class="nav_item"><a href="instructions.html">Instructions</a></li>
               <li class="nav_item"><a href="about.html">About</a></li>
            </menu>
         </nav>
      </header>
      <hr />
      <main>
         Main content renders here!
      </main>
      <div id="quote"></div>
      <hr />
      <footer>
         <div class="footer_container">
            <div>&copy;2024 Dillon Jensen</div>
            <div><a href="https://github.com/dillonj0/startup">GitHub</a></div>
            <div><a href="https://www.linkedin.com/in/dillonjensen0/">LinkedIn</a></div>
            <div><a href="https://thedillon.bandcamp.com">Music</a></div>
         </div>
      </footer>
   </div>
   );
}

