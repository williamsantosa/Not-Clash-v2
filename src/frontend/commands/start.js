const { SlashCommandBuilder } = require('discord.js');
const { createStartSelectComponent } = require('../misc/components');
const { createStartSelectEmbed } = require('../misc/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Starts the League of Legends game.'),
  async execute(interaction) {
    await interaction.reply({embeds: [createStartSelectEmbed()], components: [createStartSelectComponent()]});
  }
};