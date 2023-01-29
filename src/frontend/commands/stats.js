const { SlashCommandBuilder } = require('discord.js');
const { createStatsEmbed, createErrorEmbed } = require('../misc/embeds.js');
const { dbPath } = require('../misc/constants.js');
const db = require('../../backend/database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription(`Display's player's stats.`)
    .addUserOption(option => 
      option.setName('player')
        .setDescription('Player to display stats.')),
  async execute(interaction) {
    const player = (interaction.options.getUser('player')) ? interaction.options.getUser('player') : interaction.user;
    const playerinfo = db.getAllPlayer(dbPath, player.id);
    playerinfo.then(async res => {
      if (!res) {
        await interaction.reply({embeds: [createErrorEmbed(
          `Error displaying ${player.username}#${player.discriminator}.`, 
          `Player not found in database.`
        )]});
        console.log(`Responded with error.\nPlayer ${player.username}#${player.discriminator} not found in database.`);
      } else {
        await interaction.reply({embeds: [createStatsEmbed(
          res.discordid, 
          res.elo, 
          res.wins, 
          res.games, 
          res.primaryrole, 
          res.secondaryrole
        )]});
        console.log(`Responded with createStatsEmbed(${res.discordid}, ${res.elo}, ${res.wins}, ${res.games}, ${res.primaryrole}, ${res.secondaryrole}).`);
      }
    });
  }
};