const { SlashCommandBuilder } = require('discord.js');
const { createDeleteMatchEmbed, createErrorEmbed } = require('../misc/embeds');
const { dbPath } = require('../misc/constants');
const db = require('../../backend/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cancel')
    .setDescription('Cancels an ongoing match.')
    .addStringOption(option => 
      option.setName('matchid')
        .setDescription('MatchID to cancel.')
        .setRequired(true)),
  async execute(interaction) {
    const matchid = interaction.options.getString('matchid').trim();
    const matchinfo = db.getAllMatch(dbPath, matchid);
    matchinfo.then(async res => {
      if (!res) {
        await interaction.reply({embeds: [createErrorEmbed('Invalid matchid.', `Inputted nonexistent matchid value: ${matchid}.`)]});
        return;
      } else if ([0,1].includes(res.winteam)) {
        await interaction.reply({embeds: [createErrorEmbed('Invalid matchid.', `Inputted finished matchid value: ${matchid}.`)]});
        return;
      }
      db.deleteMatch(dbPath, matchid);
      await interaction.reply({embeds: [createDeleteMatchEmbed(matchid)]});
    });
  }
};