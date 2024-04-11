import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import './app.css'
import {Main} from './main/main'
import {Join} from './join/join'
import {Lobby} from './lobby/lobby'
import {NonHost} from './nonHost/nonHost'
import {Play} from './play/play'
import {About} from './about/about'
import {Instructions} from './instructions/instructions'

export function NotFound() {
   return <div className="notFound comp">404: Not found.</div>;
 }

export default function App() {
   
   return (
      <BrowserRouter>
         <div className='app'>
            <header>
               <h1><img alt="Mallow icon" width="50" src="android-chrome-192x192.png"/> Mallow Snatchers</h1>
               <nav>
                  <menu>
                     <li className="nav_item"><NavLink to="">Home</NavLink></li>
                     <li className="nav_item"><NavLink to="instructions">Instructions</NavLink></li>
                     <li className="nav_item"><NavLink to="about">About</NavLink></li>
                  </menu>
               </nav>
            </header>
            <hr />

            <div class='body'>
               <Routes>
                  <Route path = '/' element = {<Main />} exact />
                  <Route path = '/join' element = {<Join />} />
                  <Route path = '/lobby' element = {<Lobby />} />
                  <Route path = '/instructions' element = {<Instructions />} />
                  <Route path = '/nonHost' element = {<NonHost />} />
                  <Route path = '/play' element = {<Play />} />
                  <Route path = '/about' element = {<About />} />
                  <Route path = '*' element = {<NotFound />} exact />
               </Routes>
            </div>

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
      </BrowserRouter>
   );
}

