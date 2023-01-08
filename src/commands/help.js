const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help message for Not Clash bots.'),
  async execute(interaction) {
    await interaction.reply('Yo.');
  },
};
