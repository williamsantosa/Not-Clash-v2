const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Information about the Not Clash v2 bot.'),
  async execute(interaction) {
    await interaction.reply('Yo.');
  },
};
