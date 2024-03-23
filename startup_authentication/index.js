const express = require('express');
const bcrypt = require('bcrypt');
const config = require('./dbConfig.json');
const {MongoClient} = require('mongodb');
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const app = express();
const client = new MongoClient(url);
const db = client.db('startup');
const collection = db.collection('users');

//verify that you can connect to the database:
async function connectToDatabase() {
   try {
       await client.connect();
       console.log('Connected to MongoDB');

       return db;
   } catch (err) {
       console.error('Error connecting to MongoDB:', err);
   }
}

// Specify the client communication port
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Use json body parsing. Allow access to the front-end content folder.
app.use(express.json());
app.use(express.static('public', {root: __dirname}));

// I need a service to store all the high scores.
// Save to server memory and then reset only when the service is reset
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// register a new user
apiRouter.post('/auth/create', async (req, res) => {
   const {username, password} = req.body;

   const db = await connectToDatabase();
   const collection = db.collection('users');

   // check if the username already exists
   if(await collection.findOne({ username })){
      return res.status(400).json({message: "This username is already in use."});
   }

   // hash the password and store the information i nthe database:
   const hashedPassword = await bcrypt.hash(password, 10);
   await collection.insertOne({ username, password: hashedPassword});

   res.status(201).json({message: 'new user registration success'});
   console.log('new user ' + username + ' registered');
});

// authenticate an existing user's login credentials
apiRouter.post('/auth/login', async (req, res) => {
   const {username, password} = req.body;
   
   // See if the user exists in the database
   try {
      const user = await collection.findOne({ username });
      if (user) {
         // see if the password matches the hatched password
         const passwordsMatch = await bcrypt.compare(password, user.password);
         if(passwordsMatch) {
            // Authentication success!
            res.status(200).json({ message: 'Authentication successful!' });
         } else {
            // Password is incorrect.
            res.status(401).json({ message: 'Invalid password.' });
         }
      } else {
         // username is invalid
         res.status(404).json({ message: 'user not found' });
      }
   } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
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

// Listen on port 4000 or a port specified when you run the file
app.listen(port, () => {
   console.log(`service backend listening on port ${port}`);
});



////////////////////////////////////////////
// Old way of sending and retrieving scores
////////////////////////////////////////////
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