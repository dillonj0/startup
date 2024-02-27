# Web Programming
## Dillon Jensen

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