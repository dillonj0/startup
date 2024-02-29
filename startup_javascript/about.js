const dataString = localStorage.getItem('scoreArray');

if(dataString) {
   const data = JSON.parse(dataString);
   const tableBodyObject = document.querySelector('#scoreTable');

   data.forEach(entry => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const scoreCell = document.createElement('td');

      nameCell.textContent = entry.username;
      scoreCell.textContent = entry.score;

      row.appendChild(nameCell);
      row.appendChild(scoreCell);

      tableBodyObject.appendChild(row);
   });
} else {
   console.log("You don't have any scores to display.");
}

function sortColumn(columnIndex) {
   console.log("I didn't actually teach it to sort the table.");
}