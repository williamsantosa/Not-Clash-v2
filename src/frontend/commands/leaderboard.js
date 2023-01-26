const { SlashCommandBuilder } = require('discord.js');
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
  }
}