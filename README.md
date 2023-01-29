# Not Clash v2

Second iteration of the original [Not Clash](https://github.com/williamsantosa/Not-Clash) discord bot. Written in JavaScript and utilizes Node.js, discord.js, and SQLite.

Facilitates League of Legends matches and stores player and match information in SQLite database.

## Setup

1. Download [JavaScript](https://www.javascript.com/).
2. Download [Node](https://nodejs.org/).
3. Clone/download [repository](https://github.com/williamsantosa/Not-Clash-v2).
4. Configure config.json
   1. TOKEN: `String: Discord bot token`
      1. Go to [discord developer portal](https://discord.com/developers/applications).
      2. Click application.
      3. Click bot.
      4. Under `TOKEN`, reset token and then save the resulting token to config.json.
   2. clientId: `String: Discord bot client id`
      1. Go to [discord developer portal](https://discord.com/developers/applications).
      2. Click application.
      3. Click OAuth2.
      4. Under `CLIENT ID`, press copy.
   3. D: `Int: Effect of difference on probability to win or lose, higher = less effect`
   4. K: `Int: Maximum value a player's elo can change from one match`
5. Run `npm install`

## Starting the Bot

In project directory, run the following commands.

1. `node deploy-commands.js` to update the bot's commands.
2. `node .` to start the bot.

## How to start a Game

1. Run `/start` command.
   1. Select players to particpate in the game.
   2. Match information should be displayed.
2. To swap players, run `/swap player1 player2`.
3. To finish match, run `/finish matchid team`.
   1. Variable `matchid` can be found on the bottom left of the match embed.
   2. Variable `team` is either 1 or 2, the team that won.

## Upgrades

1. Converted from prefix to slash commands.
2. Multiple matches can happen concurrently due to match information being stored in the SQLite database.
3. Atomicity and coherency are implemented using locks.
4. Modularized, components are stored in an easy-to-follow manner and allow for great mutablility.
5. New commands.
6. Responses are more specific, terse, and offer more insight into statistics.
7. Match history.

## Commands

Complete information can be seen by running `/help command_name` when bot is running.

`cancel matchid`
> Cancels an ongoing match.

`commands`
> Information about all commands in Not Clash v2 bot.

`finish matchid team`
> Completes match and updates player/match information.

`help command`
> Help message for Not Clash v2 bot.

`info`
> Information about the Not Clash v2 bot.

`leaderboard [n1] [n2]`
> Displays the leaderboard.

`register [player] [primary] [secondary]`
> Registers player to the database.

`role [primary] [secondary]`
> Changes user's role.

`roll n1 [n2]`
> Random number from 1 to n1 or from n1 to n2, inclusive.

`start [type]`
> Starts the League of Legends game.

`stats [player]`
> Display's player's stats.

`swap matchid player1 player2`
> Swaps two players in a match.

## Where "Not Clash" Came From

Not Clash is an idea based off the original League of Legends event called "Clash" where teams of 5 players face off against one another in a bracket tournament. Thus, "Not Clash" borrows that idea and instead of a tournament, it facilitates League of Legends custom matches and stores player information into SQLite database.

## Planned Features (ROADMAP)

1. Update README with images.
2. Implement a queue with operations
3. Choose type of matchmaking. 
   1. Plan: To choose the match details, set customId to "selectUsers<matchType>"
   2. Check for the matchType using regex (like HTML link)
4. Display match history
   1. Overall match history
   2. Player match history
5. Choose player to hop to in leaderboard

## Known Errors

1. Running two commands concurrently will result in database errors cause of locks...
   1. Fix: Implement a queue in interactionCreate.js that pushes to a queue and then procesess it one by one.
