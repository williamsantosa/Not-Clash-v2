const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help message for Not Clash v2 bot.')
    .addStringOption(option => 
      option.setName('command')
				.setDescription('Returns information about a specific command.')),
  async execute(interaction) {
    await interaction.reply('Yo.');
  },
};
