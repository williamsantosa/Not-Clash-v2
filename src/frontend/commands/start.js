const { SlashCommandBuilder } = require('discord.js');
const { createStartSelectComponent } = require('../misc/components');
const { createStartSelectEmbed } = require('../misc/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Starts the League of Legends game.')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Choose type of matchmaking from random, role, elo. Defaults to random.')),
  async execute(interaction) {
    await interaction.reply({
      embeds: [createStartSelectEmbed()], 
      components: [...createStartSelectComponent()],
      ephemeral: true,
    });
  }
};