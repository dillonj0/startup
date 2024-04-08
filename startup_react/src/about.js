console.log('about.js: service deliverable version');

async function retrieveScores () {
   let dataString = '';

   try {
      // get high scores from server
      const response = await fetch('/api/scores');
      dataString = await response.json();

      // Sort scores from greatest to least
      dataString.sort((a, b) => b.score - a.score);

      // Slice the array to get only the top 10 scores
      dataString = dataString.slice(0, 10);

      // Also save to local storage
      localStorage.setItem('scoreArray', JSON.stringify(dataString));
      console.log('got scores from server');
   } catch (error) {
      console.error('error fetching data: ', error);

      // just display whatever's in local storage
      console.log('could not connect to server: displaying locally stored scores');
      const scoresText = localStorage.getItem('scoreArray');
      if (scoresText){
         dataString = JSON.parse(scoresText);
      }
   }

   displayScores(dataString);
}

function displayScores(dataString){
   if(dataString) {
      const tableBodyObject = document.querySelector('#scoreTable');

      let i = 1;
      dataString.forEach(entry => {
         const row = document.createElement('tr');
         const orderCell = document.createElement('td');
         const nameCell = document.createElement('td');
         const scoreCell = document.createElement('td');

         orderCell.textContent = i;
         orderCell.style.borderRightColor = '#CCCCCC';
         orderCell.style.borderRightWidth = '1px';
         orderCell.style.fontStyle = 'italic';
         i++;
         nameCell.textContent = entry.username;
         scoreCell.textContent = entry.score;

         row.appendChild(orderCell);
         row.appendChild(nameCell);
         row.appendChild(scoreCell);

         tableBodyObject.appendChild(row);
      });
   } else {
      console.log("You don't have any scores to display.");
   }
}

function sortColumn(columnIndex) {
   console.log("I didn't actually teach it to sort the table.");
}

retrieveScores();