import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './app.css'
import {Main} from './main/main'
import {Join} from './join/join'
import {Lobby} from './lobby/lobby'
import {NonHost} from './nonHost/nonHost'
import {Play} from './play/play'
import {About} from './about/about'
import {Instructions} from './instructions/instructions'

export default function App() {
   return (
      <div className='app'>
      <header>
         <h1><img alt="Mallow icon" width="50" src="android-chrome-192x192.png"/> Mallow Snatchers</h1>
         <nav>
            <menu>
               <li className="nav_item"><a href="index.html">Home</a></li>
               <li className="nav_item"><a href="instructions.html">Instructions</a></li>
               <li className="nav_item"><a href="about.html">About</a></li>
            </menu>
         </nav>
      </header>
      <hr />
      <main>
         <Main />
         <Join />
         <Lobby />
         <NonHost />
         <Play />
         <About />
         <Instructions />
      </main>
      <div id="quote"></div>
      <hr />
      <footer>
         <div className="footer_container">
            <div>&copy;2024 Dillon Jensen</div>
            <div><a href="https://github.com/dillonj0/startup">GitHub</a></div>
            <div><a href="https://www.linkedin.com/in/dillonjensen0/">LinkedIn</a></div>
            <div><a href="https://thedillon.bandcamp.com">Music</a></div>
         </div>
      </footer>
   </div>
   );
}

