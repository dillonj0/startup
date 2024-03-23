const express = require('express');
const DB = require('./database.js');
const bcrypt = require('bcrypt');
const cookieParser  =require('cookie-parser');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Use json body parsing. Allow access to the front-end content folder.
app.use(express.json());
app.use(express.static('public', {root: __dirname}));

// Use cookie parser middleware for parsing tokens for authentication
app.use(cookieParser());

// I need a service to store all the high scores.
// Save to server memory and then reset only when the service is reset
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// user asks to create a new user
apiRouter.post('/auth/create', async (req, res) => {
   if (await DB.getUser(req.body.username)) {
      res.status(409).send({ msg: 'Tried to create a new account for an existing user :('});
   } else {
      // This username is not on record: create a new user
      const user = await DB.createUser(req.body.email, req.body.password);

      // set the cookie
      setAuthCookie(res, user.token);

      res.send({
         id: user._id,
      });
   }
});

// When I incorporate logout functionality, need a way to delete the token
apiRouter.delete('/auth/logout', (_req, res) => {
   res.clearCookie(authCookieName);
   res.status(204).end();
});

// user calls login function: authorize or not
apiRouter.post('/auth/login', async (req, res) => {
   const user = await DB.getUser(req.body.username);
   if (user) {
      if (await bcrypt.compare(req.body.password, user.password)) {
         setAuthCookie(res, user.token);
         res.send({id: user.id});
         return;
      }
   } else {
      res.status(401).send({ msg: 'Unauthorized!'});
   }
});

// process a request that submits a new score
apiRouter.post('/score', (req, res) => {
   console.log('in apiRouter.post...');
   // take the information from the request and save it: save the score
   scoreArray = updateScores(req.body, scoreArray);
   res.send(scoreArray);
   console.log('---> score sent to top score list.');
});

// Send the all time best scores back:
apiRouter.get('/scores', (_req, res) => {
   res.send(scoreArray);
   console.log('Score array sent back to client');
});

// Simon service uses this code to send you to home if you ask for
//    some weird unknown page in your http request
app.use((_req, res) => {
   res.sendFile('index.html', {root: 'public'});
   console.log('unknown page requested, redirecting client to home page...');
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
   res.cookie(authCookieName, authToken, {
     secure: true,
     httpOnly: true,
     sameSite: 'strict',
   });
}

// Listen on port 4000 or a port specified when you run the file
app.listen(port, () => {
   console.log(`service backend listening on port ${port}`);
});

let scoreArray = [];
function updateScores(newScore, scores) {
   let areThereScores = false;
   for (const [i, prevScore] of scoreArray.entries()) {
      if (newScore.score > prevScore.score) {
         console.log('incoming score score added to the top 10!');
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
      console.log('incoming score added to root.')
      scores.push(newScore);
   }

   // Sample code includes this so the high score data doesn't save an
   //    infinite number of high scores. Keep only top 10.
   if (scores.length > 10) {
      console.log('score list truncated: top 10 only.');
      scores.length = 10;
   }

   return scores;
}