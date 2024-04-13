import React from "react";
import { NavLink } from "react-router-dom";

export default function Instructions() {
   return (
   <main>
      <img alt='graphic respresentation of the gameply instructions' src="HowToPlay.png"/>
      <NavLink to="/">
        <button className="btn btn-outline-secondary" id="start-button">Got it!</button>
      </NavLink>
    </main>
   );
 }