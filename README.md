# Not Clash v2

Second iteration of the original [Not Clash](https://github.com/williamsantosa/Not-Clash) discord bot. Written in JavaScript and utilizes Node.js, discord.js, and SQLite.

Facilitates League of Legends matches and stores player and match information in SQLite database.

## Setup

1. Download [JavaScript](https://www.javascript.com/).
2. Download [Node](https://nodejs.org/).
3. 

## Upgrades

1. Converted from prefix to slash commands.
2. Multiple matches can happen concurrently due to match information being stored in the SQLite database.
3. Atomicity and coherency are implemented using locks.
4. Modularized, components are stored in an easy-to-follow manner and allow for great mutablility.
5. New commands.
6. Responses are more specific, terse, and offer more insight into statistics.
7. Match history.

## Where "Not Clash" Came From

Not Clash is an idea based off the original League of Legends event called "Clash" where teams of 5 players face off against one another in a bracket tournament. Thus, "Not Clash" borrows that idea and instead of a tournament, it facilitates League of Legends custom matches and stores player information into SQLite database.

## Planned Features

1. Choose type of matchmaking. 
   1. Plan: To choose the match details, set customId to "selectUsers<matchType>"
   2. Check for the matchType using regex (like HTML link)
2. Display match history
   1. Overall match history
   2. Player match history
3. Choose player to hop to in leaderboard
