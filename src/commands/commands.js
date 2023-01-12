const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('commands')
    .setDescription('Information about all commands in Not Clash v2 bot.')
    .addStringOption(option => 
      option.setName('command')
				.setDescription('Returns information about a specific bot command.')),
  async execute(interaction) {
    await interaction.reply('Yo.');
  },
};
