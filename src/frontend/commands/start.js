const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Starts the League of Legends game.'),
  async execute(interaction) {return;}
};