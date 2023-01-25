const { SlashCommandBuilder } = require('discord.js');
const { color } = require('../misc/embeds.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Registers player to the database.')
    .addStringOption(option =>
      option.setName('primary role'))
        .setDescription('Sets the primary role for the player.')
    .addStringOption(option =>
      option.setName('secondary role'))
        .setDescription('Sets the secondary role for the player.'),
  async execute(interaction) {
    const primary = interaction.operations.getString('primary role');
    const secondary = interaction.operations.getString('secondary role');
  },
};