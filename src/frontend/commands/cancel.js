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
    const matchid = interaction.options.getString('matchid');
    const matchinfo = db.getAllMatch(dbPath, matchid);
    matchinfo.then(async res => {
      if (!res || [0,1].includes(res.winteam)) {
        await interaction.reply({embeds: [createErrorEmbed('Invalid input matchid.', `Inputted matchid value of ${matchid}.`)]});
        return;
      }
      db.deleteMatch(dbPath, matchid);
      await interaction.reply({embeds: [createDeleteMatchEmbed(matchid)]});
    });
  }
};