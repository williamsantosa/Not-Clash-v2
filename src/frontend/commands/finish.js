const { SlashCommandBuilder } = require('discord.js');
const { createFinishEmbed, createErrorEmbed } = require('../misc/embeds');
const { dbPath } = require('../misc/constants');
const db = require('../../backend/database');
const st = require('../../backend/statistics');
const { D, K } = require('../../../config.json');

const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('finish')
    .setDescription('Completes match and updates player/match information.')
    .addStringOption(option => 
      option.setName('matchid')
        .setDescription('MatchID to finish.')
        .setRequired(true))
    .addNumberOption(option => 
      option.setName('team')
        .setDescription('Winning team. Either 1 or 2.')
        .setRequired(true)),
  async execute(interaction) {
    const matchid = interaction.options.getString('matchid').trim();
    const team = interaction.options.getNumber('team');

    // Check winning team value (1,2)
    if (![1,2].includes(team)) {
      await interaction.reply({embeds: [createErrorEmbed('Invalid team.', `Inputted team value: ${team}.`)]});
      console.log(`Responded with error embed.\nInvalid team value: ${team}.`);
      return;
    }

    // Grab match info
    console.log(`Getting match info...`);
    const matchinfo = db.getAllMatch(dbPath, matchid);
    matchinfo.then(async res => {
      console.log(`Finished get.`);

      // Check for nonexistent and finished matches
      if (!res) {
        await interaction.reply({embeds: [createErrorEmbed('Invalid matchid.', `Inputted nonexistent matchid value: ${matchid}.`)]});
        console.log(`Responded with error embed.\nNonexistent matchid value: ${team}.`);
        return;
      } else if ([0,1].includes(res.winteam)) {
        await interaction.reply({embeds: [createErrorEmbed('Invalid matchid.', `Inputted finished matchid value: ${matchid}.`)]});
        console.log(`Responded with error embed.\nFinished matchid value: ${team}.`);
        return;
      }

      // Update match with winning team
      console.log(`Updating match with winning team ...`);
      await interaction.deferReply();
      const winteam = team - 1;
      db.modifyMatch(dbPath, matchid, 'winteam', winteam);
      await wait(1000);
      console.log(`Finished update.`);

      // Grab player info
      console.log(`Getting player info...`);
      const playersInfo = [];
      for (let i = 0; i < 10; i ++) {
        playersInfo.push(db.getAllPlayer(dbPath, res[`player${i}`]));
      }
      Promise.all(playersInfo)
        .then(async res => {
          console.log(`Finished get.`);

          // Separate into teams
          const team1 = res.slice(0,5);
          const team2 = res.slice(5,10);

          // Calculate team elo
          let team1elo = 0;
          let team2elo = 0;
          for (let i = 0; i < 5; i++) {
            team1elo += team1[i].elo;
            team2elo += team2[i].elo;
          }
          team1elo = team1elo / 5;
          team2elo = team2elo / 5;

          // Calculate new team elo and +/- elos
          const newTeamElo = st.eloRating(team1elo, team2elo, D, K, winteam);
          const diff1 = Math.abs(newTeamElo[0] - team1elo);
          const diff2 = Math.abs(newTeamElo[1] - team2elo);

          // Update players
          console.log(`Updating team1...`);
          for (const player of team1) {
            db.modifyPlayer(dbPath, player.discordid, 'elo', (winteam === 0) ? (player.elo + diff1) : (player.elo - diff1));
            db.modifyPlayer(dbPath, player.discordid, 'games', player.games + 1);
            if (winteam === 0) {
              db.modifyPlayer(dbPath, player.discordid, 'wins', player.wins + 1);
            }
          }
          console.log(`Finished update.`);
          console.log(`Updating team2...`);
          for (const player of team2) {
            db.modifyPlayer(dbPath, player.discordid, 'elo', (winteam === 1) ? (player.elo + diff2) : (player.elo - diff2));
            db.modifyPlayer(dbPath, player.discordid, 'games', player.games + 1);
            if (winteam === 1) {
              db.modifyPlayer(dbPath, player.discordid, 'wins', player.wins + 1);
            }
          }
          console.log(`Finished update.`);

          // Reply
          await interaction.editReply({embeds: [createFinishEmbed(matchid, team1, team2, diff1, diff2, winteam)]});
          console.log(`Responded with createFinishEmbed(${matchid}, ${team1}, ${team2}, ${diff1}, ${diff2}, ${winteam}).`);
        });
    });
  }
};