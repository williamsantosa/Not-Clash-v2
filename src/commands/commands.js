const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('commands')
    .setDescription('Information about all commands in Not Clash bot.')
    .addStringOption(option => 
      option.setName('command')
				.setDescription('Command to get information of.')),
  async execute(interaction) {
    await interaction.reply('Yo.');
  },
};
