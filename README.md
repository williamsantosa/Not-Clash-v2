# Not Clash v2

Upgraded version of [Not Clash](https://github.com/williamsantosa/Not-Clash).

## ROADMAP

1. Update match to the database when creating the match embed
   1. Use database function to register match
   2. player 0 - 4 is discordid of team 1 and in (top, jungle, ...) order, 5 - 9 is discordid of team 2 and in (top, jungle, ...) order
2. Create `finish` slash command taking input matchid and winning team
   1. Update database with who wins
   2. Update player information
3. Create `swap` slash command taking input matchid, player1, player2 to swap
4. Create `cancel` slash command taking input matchid to remove match from match history iff no winning team supplied
5. (IN-BETWEEN) Create console log functions
6. Create README.md