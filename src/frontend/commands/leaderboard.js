const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createLeaderboardEmbed, createErrorEmbed } = require('../misc/embeds.js');
const { dbPath } = require('../misc/constants.js');
const db = require('../../backend/database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Displays the leaderboard.')
    .addUserOption(option => 
      option.setName('player')
        .setDescription('Player to jump to on the leaderboard.')),
  async execute(interaction) {
    const player = interaction.options.getUser('player');
    const players = db.getAllPlayers(dbPath, 'elo');
    players.then(async res => {
      await interaction.reply({
        embeds: [createLeaderboardEmbed(res, 0, (res.length <= 10) ? res.length : 10)],
        components: [new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('left')
              .setLabel('Left')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('right')
              .setLabel('Right')
              .setStyle(ButtonStyle.Primary)
        )]
      });
    })
    .catch(async err => {
      console.log(err);
      await interaction.reply({embeds: [createErrorEmbed('Leaderboard error.', 'Error occurred while displaying leaderboard.')]});
    });
  }
}