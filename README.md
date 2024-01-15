# Mallow Snatchers
An application for CS

## Specification Deliverable
### Elevator Pitch
Tired of family parties that inevitably just turn into awkward venting sessions? Look no further!
Mallow Snatchers is a fast-paced bidding game for the whole family! Be careful though---the more Mallows you grab, the more you'll want to keep playing, and you may have so much fun that you'll explode.

### Design
![Home screen before user logs in](MallowSnatchersUIhome.jpg)
On the home screen, the user will be able to join an open game or create their own once they have an account.

![Log in screen](MallowSnatchersUI_login.jpg)
This is an example of how the account creation/login screen would look.

Once a user is in a game, their only interaction with the server will be to tell the game when they "snatch" during each round of gameplay. The server will "roll" every three seconds and either add Mallows to a running total or end the round, depending on a random numnber generation.
If a user "snatches," they get as many Mallows as are on the running total at that time, but are locked in with that point value even if the number of Mallows increases with subsequent "rolls." If the server's random number determines that a given roll has ended the round, any player that failed to "snatch" gets 0 mallows.
![Mallow Snatchers gameplay](MallowSnatchersUI_gameplay.jpg)
A running Mallow total is displayed along the bottom of the screen, where a user's icon might increase in size in accordance with their point total.

### Key features
- Secure login and stored username
- Ability to join or create games
- Point totals from each user updated in real time
- Gameplay continues automatically until the end of all 15 rounds

### Technologies
I will use...
- **HTML** to structure the login and home screens and the UI for gameplay
- **CSS** to style the application objects and make sure things scale effectively for different systems
- **JAVASCRIPT** to handle user input and gameplay feedback
- **BACKEND SERVICE** to verify login and countdown timer/random number generator during gameplay
- **DB/LOGIN** to record login information: users must register to play.
- **WebSocket** to handle the communication between the "dealer" and the players; user input on one machine must be reflected in updates on the other players' devices so that the score and gameplay is consistent across all fronts.
- **React** to make the application look really good once I figure out how to use it.