# Web Programming
## Dillon Jensen

### _29/FEB/2024_
#### Web frameworks
React
- Instead of writing html & css totally seperately, it's all done in one interface which is craaaazy!
- Moving parts and transpilation
- The easy part is that now we only actually need one HTML page;
--> The users' actions navigate a switch that could (for example) read the URL and change the body section of the DOM
- Your component functions have to be uppercase or it'll assume they're intended to be actual HTML elements

Components, hooks

### _25/FEB/2024_
#### Security
Soooo expensive!!!! Consider the collateral damage:
- If you lose contact with your clients, you lose a ton of money, but the clients are destabilized too;
- People can literally die because of the ripple effect; crippling debt, loss of assets, total supplychain disruption

"As disciples of Christ, this should bother us a lot!" - Lee Jensen, 2024
- It's irresponsible _not_ to take security into account. We are dealing with people's lives.

1. Broken access control:
- Important to actually reference tokens and verify that the person presenting their username is actually the account owner:
--> Other wise you can just bypass everything with front-end dev tools and URL bypass strategies.
2. Cryptographic Failures:
- Data sent as clear text
- Data not encrypted at rest or transit
--> Even data that's hard to get to should never be stored except in an encrypted format.
- Weak cryptography
--> bcrypt with intensity of 1
- Misused cryptography:
--> No salt, 

3. Code Insertion:
- Must sanitize inputs or you could end up getting a person's commands executing on your own account.

4. Insecure Design:
--> If people within the company aren't aware of best practices, potential weaknesses, you end up with a huge loss.
--> Storing all your data in one place
--> Unlimited trial accounts
--> Single layer of defense

5. Security Misconfiguration
- Exposure of development information
--> If someone gets information you weren't intending to lend, they have an edge against your security
- Using default configurations
--> Imagine if everyone set up their internet without changing their default passwords.
- Unnecessary features installed
--> No way you can keep an eye on everything, so why have all kinds of things installed if you're not actually using them?
- System not hardened
--> Example would be where any IP address can get access to your MongoDB: reduce access as much as possible!

6. Vulnerable components
- Installing packages you don't need/use, importing blindly without verifying that it's actually a trusted source.
- Out-of-date software may have long-standing vulnerabilities that people know about. Remove or update to a secure version!

7. ID and authentication failures:
- Allowing users to have weak passwords
- Poor process for recovering credentials
- Infinite authentication tokens
- Credentials accessible from the URL wahp wahp

8. Software integrity failures
- Using unverified content-delivery network, i.e. bootstrap or npm

9. Logging failures
- If someone gets into your system and you don't have ways to track them un-deleteably, you're going to have a bad time.

10. Something else

Last but not least, be aware that in a browser setting basically the only thing you can trust is the host name. Essentially everything else can be made to be deceptive using javascript and formatting tools.

### _18/FEB/2024_
#### Storing passwords
- Need to store in a database: can't keep it in server memory because if it goes down you lose everything.
- Can't just put them in a database because if it's not encrypted you are super at risk.
--> Anyone with permission can get in to everything
##### Secure storage:
- Hashing: some algorithm changes a user's password and the bungled version is stored: you don't know what the password is when you store it, but if they put in their password again the algorithm can tell you that it either matches or doesn't because the output is the same.
--> Someone could manually compute every hash value corresponding to a bunch of common passwords. "Hash table attack"
- Salted: generate some random text (salt) to append to the user password then store the hashed output with the salt key appended to the beginning so the backend can compare the whole code
--> Greatly slows the speed of making a hash table because you have to compute a different table for every single generate salt value
This is good but it can't be the authentication process for every backend call: it would take too long. More typically the authentication process is carried out once and then the user is given a token ID that is used to 

### _11/FEB/2024_
#### Notes about Startup Service:
- Main issue I ran into was in listing service calls out of order in my index.js top level
- In a future iteration I'll need to figure out how to update the other players' scores on the screen

#### Environments
- Don't do development in your production environment:
-> Easy to write over changes with the next development push
-> If something goes wrong it can be really really hard to figure out where the error came from
- Different environments for different purposes:
-> Might have a staging environment in addition to production etc.

#### Deployment
##### Our deployment model
- Stop the program
- Replace the code
- Start the new version
- Pray it works!

##### More common models: rolling drain & replace, Canary, Blue/Green, A/B
- Have to have multiple servers balancing load, lets you update your software without any downtime:
--> Feed requests to several different servers. When you want to update, stop sending requests to one server until it's empty. Load new code. Continue until all servers are running new code only.
--> Slowly transition over and make sure there are no errors before asking for more new traffic
--> Blue-green would be like deploy code on one set of servers, do your staging on the other and then pass back and forth between which one is the publicly-accessed 
--> A/B would be to direct some traffic to a slightly different version of the same product to see if they have some sort of better experience, i.e., did they click through a certain version of the ad more often?

#### Uploading files
- Front end: File input
- Back end: npm Multer service
--> I didn't get my example running, but it worked great in Dad's demo haha

### _06/FEB/2024_
Make sure Startup_service is configured to listen on port 4000 instead of 3000 or I'll be in conflict with Simon

### _04/FEB/2024_
Node - Run JS as the whole stack instead of referring to backend C etc.
*express* - 
- basically does the whole middleware thing interpreting its own stuff fairly well in a self-contained way rather than making you do all the http heavy lifting
- Install in a project directory: mkdir -> cd -> npm init -y -> npm install express
- Use in a project:
```
const express = require('express');
const app = express();

app.get('*', (req,res) => {
   res.send('<h1>Hello Express!</h1>')
});

app.listen(3000);
```
- -> When you send any request to port 3000, the server is going to respond by generating the HTML to display the message "Hello express!"

*middleware*
```
app.use(function (req, res, next) {
   console.log('Time: %d', Date.now());
   next();
});
```
- You need to send 1 response somewhere, but sometimes you want to do multiple actions before you finish handling the request; The example above is going to log out the time that a request was received, but beware that *_the time will be logged on the server side, not the client side_.*
```
app.use(express.static('public', {root: __dirname}));
```
- *express.static* will automatically load the html file in the specified directory if it exists. Basically, this lets you just add an html filename to the URL and the HTTP request will get a response directing you to load the file to the page.

Execution order matters.

### _26/FEB/2024_
When adding JS, use the script rather than the HTML to transition between the login page and the play screens so that I also have time to record the username information.
## Servers etc.
Different processes to get machines at different addresses linked to each other.
- Transport:
- - TCP is thorough and verifies that the correct signal was received
- - UDP is faster and just keeps slammin' packets down the ol' pipe

443 is secure HTTP port, reserved specifically for such communications. Has to specify protocol and port number.
- These days, there's no reason to not have a certificate these days

### _21/FEB/2024_
## LocalStorage
# Store variables on a users API between refreshes etc.
# _Items bust be string, number, or boolean. Use JSON.stringify() or JSON.parse() to add/remove other items (i.e. array, object) in local storage._
setItem(name, value)
- Sets a named item's value into local storage
getItem(name)
- Gets a named item's value from local storage
removeItem(name)
- Removes a named item from local storage
clear()
- Clears all items in local storage

### _20/FEB/2024_
## Promises
Everything in JavaScript must be asynchronous; if you're waiting for some long process to execute, you're going to be totally locked up and having a bad time.
- `setTimeout( () => {//run some code}, time_in_ms)` function is built in and lets you wait a certain number of milliseconds before trying to run the stuff in brackets.
- `pending` is currently running asynchronously
- `fulfilled` is completed successfull
- `rejected` failed to complete
`new Promise((resolve, reject) => resolve(true)`
- Call the resolve function, then set the state depending on what happened with the function call.

# async/await
- Avoid await except inside of an async function so that you don't lock up your top-level execution.
- async function will create a promise wrapper... play with it and it'll start to make more sense I guess.

### _12/FEB/2024_
Notes on Simon.css launch:
- Made main body text align to end and changed source background color to red.

Notes on JavaScript
- All kinds of different structures we can use to get our point accross.

### _09/FEB/2024_
*JavaScript*
about:blank gives you a window where you can open the console and have an immediate JavaScript interpreter.
String concatenation is easy---like in Python you can just do
`console.log('hey' + 'you')`
functions have to be declared by first saying "function," as in Python

declare a variable:
`let x = 1`
As you code, you can keep changing the variable type by reassigning the variable
`x = '1'`
`x = undefined`
A function is actually a primitive

*css* I really like the look of this button for mallowsnatchers
`<button type="button" class="btn btn-outline-success">snatch now!</button>`

### _05/FEB/2024_
Scaleability is constantly a concern; especially migrating between devices or supported languages, you have to make sure you as the programmer take variation into account rather than just hoping that the host devices figure it all out on their own.
- Grid scaling puts every child element in a box of maximum possible size within certain constraints that still fit in the screen/allowed space.
- Flex scaling makes it super easy to say what direction things scale in and how much of the screen each item should take up.
@media etc... media queries let you determine how to change styling if certain criteria are met.

### _02/FEB/2024_
My startup HTML has to include 3rd party services. The Startup Specification page has a list of 3rd party apps that I can communicate with in my actual application.
## CSS
in the HTML head,
<link href="[filename].css" rel="stylesheet">
different fonts; if you want to use a font you go to fonts.google.com
- Download font family that you like?
- - @font-face{
       font-family: "Quicksand"
       src: url("[location of the font file you downloaded]")
    }
- @import url("[link that google gives you for the font you want]")
- - body {font-family: Rubik}
## Unicode & UTF 8
Unicode has like 4 billion possible characters
-> to cut down on file size and all, UTF-8 checks the first bit of each character, and this bit tells the processor whether or not to use additional bits to determine which character you're trying to render.
## Animation
p {
   text-align: center;
   font-size: 20vh;
   animation-name: demo;
   animation-duration: 3s;
   // animation: demo 1s infinite y7alternate;
}
@keyframes demo {
   from {
      font-size: 0vh;
      color: purple;
   }
   95% {
      color: lightgrey;
      font-size: 21vh;
   }
   to {
      color: black;
      font-size: 20vh;
   }
}
In demonstration, he used a comma seperated list to call out specifically one tag in the HTML, i.e.
```header, main, footer { }```
"Any descendant is the space, if you do a comma it's just any"
Content -> Pals -> Before -> Margin... something

for html objects with a class declared, use the class selector in CSS to pick them out specifically:
```
for <span class='lava'>oh no there is lava</span>
use .summary { } in your css
```
vh is percent of the viewport's height


### _30/JAN/2024_
To put Simon.html on my page under the simon heading, I used the prescribed deployment file and pushed it using the secure key out to the web.

### _29/JAN/2024_
My app HTML could look something like this structure
```
<!DOCTYPE html>
<html>
   <head></head>
   <body>
      <header>
         <nav>
            <h1>Title</h1>
            <menu>
               <li></li> <!-- Links to other pages in site-->
               <li></li>
               <li></li>
            </menu>
         </nav>
      </header>
      <main>
         <h1>Title</h1>
         <p>(description)</p>
         <form></form>
      </main>
      <footer>
         (information, links to creator data?)
      </footer>
   </body>
</html>
```

### _26/JAN/2024_
HTML gives your site structure. The more helpful structure tags you can give to your site, the better the user's device (etc.) will be able to interpret what's going on.

### _22/JAN/2024_
Route 53 gets you a URL and directs it toward a specific server.
Caddy controls which files a URL feeds you to---like if I do mail.google.com it sends me to gmail instead of google.com homepage.
If your connection to a site is not secure that means that all the communication between you and every middle-man site is unencrytped.
--> Could even include people on the same wireless network.
Gotta use Let's Encrypt etc.

### _19/JAN/2024_
Technology stack
- HTML/JS/CSS communicate with the server
- Caddy determines whether that communication pertains to one service or another (i.e. is it my startup or is it Simon running on my same AWS account?)
- Server exchanges information with the database

### _12/JAN/2024_
HTML - Elements in the webpage
CSS - Layout & styling
JavaScript - Script monitoring the 
Service - What you're giving the client
Database/Login - Persisted app and auth data
WebSocket - Data pushed from server, chat
React - Web framework

_If I do the dice game that Max and Emily taught us, we would..._
_...use HTML & CSS to design the UI._
_...use JavaScript to actually run the game etc._
_...allow users to connect to the game._
_...require users to create some account before they can play, though they could maybe see scores beforehand._
_...use WebSockets to pass signals between the dealer and the players._
_...use React for whatever React does?_

*Assignment due Wednesday:*
Update README.md to include elevator pitch, sketch of tech
- Key features, technologies

### _11/JAN/2024_
Basically, every time I work on my startup I should begin with
```
git pull
(... make changes to the code)
git add *
git commit -m "<some description>"
git push
```
and I'm going to want to commit new changes several times per project and per workday so I can show my progress and save my edits in case I blow it and have to go back in time etc.

### _10/JAN/2024_
This text was included to _show_ that I have a rudamentary understanding of markdown