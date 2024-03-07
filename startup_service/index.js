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
let scoreArray = [];