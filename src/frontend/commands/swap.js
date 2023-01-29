const { SlashCommandBuilder } = require('discord.js');
const { createMatchEmbed, createErrorEmbed } = require('../misc/embeds');
const { dbPath } = require('../misc/constants');
const db = require('../../backend/database');
const st = require('../../backend/statistics');
const { D, K } = require('../../../config.json');

const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('swap')
    .setDescription('Swaps two players in a match.')
    .addStringOption(option =>
      option.setName('matchid')
        .setDescription('MatchID of player swap.')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('player1')
        .setDescription('First player to swap with.')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('player2')
        .setDescription('Second player to swap with.')
        .setRequired(true)),
  async execute(interaction) {
    // Get matchid, player1, player2
    const matchid = interaction.options.getString('matchid').trim();
    const player1 = interaction.options.getUser('player1');
    const player2 = interaction.options.getUser('player2');

    // Error check
    if (player1 === player2) {
      await interaction.reply({embeds: [createErrorEmbed('Error occurred.', `Same player inputted: <@${player1.id}>.`)]});
      console.log(`Responded with error. Same player.`);
      return;
    }

    // Grab match info
    console.log(`Getting match info...`);
    const matchinfo = db.getAllMatch(dbPath, matchid);
    matchinfo.then(async res => {
      // Process matchinfo
      console.log(`Finished get.`);
      if (!res) {
        await interaction.reply({embeds: [createErrorEmbed('Invalid matchid.', `Inputted nonexistent matchid value: ${matchid}.`)]});
        console.log(`Responded with error. Nonexistent matchid value: ${matchid}`);
        return;
      } else if ([0,1].includes(res.winteam)) {
        await interaction.reply({embeds: [createErrorEmbed('Invalid matchid.', `Inputted finished matchid value: ${matchid}.`)]});
        console.log(`Responded with error. Finished matchid value: ${matchid}`);
        return;
      }

      // Grab ids
      const ids = Object.values(res).slice(1,-1);
      const indexPlayer1 = ids.findIndex(e => e === player1.id);
      const indexPlayer2 = ids.findIndex(e => e === player2.id);

      // Error check
      if (indexPlayer1 < 0 && indexPlayer2 < 0) {
        await interaction.reply({embeds: [createErrorEmbed('Invalid players.', `Inputted nonexistent player1 and player2 value: <@${player1.id}>, <@${player2.id}>.`)]});
        console.log(`Responded with error.\nNonexistent player1 and player2 value: <@${player1.id}>, <@${player2.id}>.`);
        return;
      } else if (indexPlayer1 < 0) {
        await interaction.reply({embeds: [createErrorEmbed('Invalid player.', `Inputted nonexistent player1 value: <@${player1.id}>.`)]});
        console.log(`Responded with error.\nNonexistent player1 value: <@${player1.id}>.`);
        return;
      } else if (indexPlayer2 < 0) {
        await interaction.reply({embeds: [createErrorEmbed('Invalid player.', `Inputted nonexistent player2 value: <@${player2.id}>.`)]});
        console.log(`Responded with error.\nNonexistent player1 value: <@${player2.id}>.`);
        return;
      }

      // Swap players
      console.log('Swapping players...')
      db.modifyMatch(dbPath, matchid, `player${indexPlayer1}`, player2.id);
      await wait(700);
      db.modifyMatch(dbPath, matchid, `player${indexPlayer2}`, player1.id);
      await wait(700);
      console.log('Finished swap.')

      // State that bot is processing
      await interaction.deferReply();

      // Run queries for each of the players
      const playersInfo = [];
      const temp = ids[indexPlayer1];
      ids[indexPlayer1] = ids[indexPlayer2];
      ids[indexPlayer2] = temp;
      console.log('Grabbing player information...')
      for (let i = 0; i < ids.length; i++) {
        playersInfo.push(db.getAllPlayer(dbPath, ids[i]));
      }

      // Once queries are processed, check if player exists
      // If not, register player and get their updated values
      Promise.all(playersInfo)
        .then(async res => {
          console.log('Finished grab.');
          for (const [i, player] of res.entries()) {
            if (!player) {
              console.log(`Registering player ${interaction.values[i]}...`);
              db.registerPlayer(dbPath, interaction.values[i]);
              await wait(1500);
              console.log(`Finished registering.`);s
              const id = interaction.values[i];
              res[i] = await db.getAllPlayer(dbPath, id);
            };
          }
          return res;
        })
        .then(async res => {
          Promise.all(res)
            .then(async playersInfo => {
              // Sort teams
              const teams = {'0': [], '1': []};
              for (const [i, p] of playersInfo.slice(0,5).entries()) {
                teams['0'].push({player: p, role: i});
              }
              for (const [i, p] of playersInfo.slice(5,10).entries()) {
                teams['1'].push({player: p, role: i});
              }

              await interaction.editReply({
                ephemeral: false,
                embeds: [createMatchEmbed(teams, matchid)],
                components: [],
              });
              console.log(`Responded with createMatchEmbed(${teams}, ${matchid}).`);
            });
        });
    });
  }
};