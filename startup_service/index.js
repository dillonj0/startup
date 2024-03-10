const express = require('express');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Use json body parsing. Allow access to the front-end content folder.
app.use(express.json());
app.use(express.static('public', {root: __dirname}));

// Listen on port 4000 or a port specified when you run the file
app.listen(port, () => {
   console.log(`service backend listening on port ${port}`);
});

// Simon service uses this code to send you to home if you ask for
//    some weird unknown page in your http request
app.use((_req, res) => {
   res.sendFile('index.html', {root: 'public'});
   console.log('unknown page requested, redirecting client to home page...');
});

// I need a service to store all the high scores.
// Save to server memory and then reset only when the service is reset
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// process a request that submits a new score
apiRouter.post('/score', (req, res) => {
   console.log('in apiRouter.post...');
   // take the information from the request and save it: save the score
   scoreArray = updateScores(req.body, scoreArray);
   res.send(scoreArray);
   console.log('score sent to top score list.');
});

// Send the all time best scores back:
apiRouter.get('/scores', (_req, res) => {
   res.send(scoreArray);
   console.log('Score array sent back to client');
});

let scoreArray = [];
function updateScores(newScore, scores) {
   let areThereScores = false;
   for (const [i, prevScore] of scoreArray.entries()) {
      if (newScore.score > prevScore.score) {
         // The score is better than the one at this point in the list
         // -> insert the score into the array
         scores.splice(i, 0, newScore);
         areThereScores = true;
         break;
      }
   }

   // If the score wasn't better than any on the list, stick it at the end
   // -> Also covers the case where there are no high scores yet.
   if (!areThereScores){
      scores.push(newScore);
   }

   // Sample code includes this so the high score data doesn't save an
   //    infinite number of high scores. Keep only top 10.
   if (scores.length > 10) {
      scores.length = 10;
   }

   return scores;
}