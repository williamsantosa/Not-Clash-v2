const { SlashCommandBuilder } = require('discord.js');
const { createStatsEmbed } = require('../misc/embeds.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .addUserOption(option =>
      option.setName('player')
        .setDescription('Player to display stats.')),
  async execute(interaction) {
    const player = (interaction.options.getUser('player')) ? interaction.options.getUser('player') : interaction.user;
  }
};