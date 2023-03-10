const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createLeaderboardEmbed, createErrorEmbed } = require('../misc/embeds.js');
const { dbPath } = require('../misc/constants.js');
const db = require('../../backend/database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Displays the leaderboard.')
    .addNumberOption(option =>
      option.setName('n1')
        .setDescription('Up to rank / start at rank.'))
    .addNumberOption(option =>
      option.setName('n2')
        .setDescription('Last rank.')),
  async execute(interaction) {
    // Grab players information
    console.log(`Getting players information...`);
    const players = db.getAllPlayers(dbPath, 'elo');
    const n1 = interaction.options.getNumber('n1');
		const n2 = interaction.options.getNumber('n2');

    // Process players
    players.then(async res => {
      console.log('Finished get.');

      // Set start and end points
      let start = 0
      let end = (res.length > 8) ? 8 : res.length;
      if (n1 && n2) {
        start = (n1 <= end && n1 > start) ? n1 : start;
        end = (end > start && n1 <= n2 && n2 <= end) ? n2 : end;
      } else if (n1 && !n2) {
        end = (n1 < end && n1 > start) ? n1 : end;
      }

      // Reply
      await interaction.reply({
        embeds: [createLeaderboardEmbed(res, start, end)],
      });
      console.log(`Responded with createLeaderboardEmbed(${res}, ${start}, ${end}).`);
    })
    .catch(async err => {
      console.log(err);
      await interaction.reply({embeds: [createErrorEmbed('Leaderboard error.', 'Error occurred while displaying leaderboard.')]});
      console.log(`Responded with error.\nInternal server error.`);
    });
  }
}