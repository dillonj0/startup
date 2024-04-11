import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export function About() {
  const [scores, setScores] = useState([]);

   useEffect(() => {
      retrieveScores();
   }, []);

   async function retrieveScores() {
      try {
         const response = await fetch('/api/scores');
         const data = await response.json();
         const sortedData = data.sort((a, b) => b.score - a.score).slice(0, 10);
         setScores(sortedData);
         localStorage.setItem('scoreArray', JSON.stringify(sortedData));
         console.log('Got scores from server');
      } catch (error) {
         console.error('Error fetching data: ', error);
         const scoresText = localStorage.getItem('scoreArray');
         if (scoresText) {
            const localScores = JSON.parse(scoresText);
            setScores(localScores);
            console.log('Could not connect to server: Displaying locally stored scores');
         }
      }
   }
  return (
  <main>
        <p>Mallow Snatchers is a game of strategy and pressing one's
            luck. During play, the players compete to amass as many 
            delicious marshmallows as possible. Every 3 seconds, the 
            number of available marshmallows will increase. At any point,
            players can hit the "SNATCH NOW!" button to add the displayed
            number of mallows to their total. But be careful! If you press
            your luck too far, all the mallows will go away and
            you will get none!</p>
        <p>Average playtime: 5-10 minutes</p>
        <h3>All Time High Scores</h3>
        <table id='scoreTable' style = {{marginBottom: '10px'}}>
          <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Score</th>
              </tr>
          </thead>
          <tbody>
            {scores.map((entry, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{entry.username}</td>
                    <td>{entry.score}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <NavLink to="join"><button className="btn btn-outline-secondary">Back to lobby</button></NavLink>
    </main>
  );
 }