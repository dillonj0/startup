import React from "react";

export function Lobby() {
  return (
  <main>
    <span id="player-name"></span>
    <div id="host-name" style = 'font-style: italic'></div>
    <div id = 'wait' style = "font-style: italic; display: none;">Waiting for the host to start the game...</div>
    <NavLink to = '/play'>

      {/* Actually, I don't think we want to go straight there.
        Tell the other players to start the game */}

      <button className="btn btn-success" id="start-button" style="display: none">Start the game</button>
    </NavLink>
  </main>
  );
}