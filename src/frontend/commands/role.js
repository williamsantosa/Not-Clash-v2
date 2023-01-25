const { SlashCommandBuilder } = require('discord.js');
const { roles, dbPath } = require('../misc/constants.js');
const { createRoleEmbed, createErrorEmbed } = require('../misc/embeds.js');
const db = require('../../backend/database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription(`Changes user's role.`)
    .addStringOption(option =>
      option.setName('primary')
        .setDescription('Sets the primary role for the player.'))
    .addStringOption(option =>
      option.setName('secondary')
        .setDescription('Sets the secondary role for the player.')),
  async execute(interaction) {
    const player = interaction.user;
    let primary = interaction.options.getString('primary');
    let secondary = interaction.options.getString('secondary');
    if (primary) primary = primary.toLowerCase();
    if (secondary) secondary = secondary.toLowerCase();

    if (!roles.includes(primary) && !roles.includes(secondary)) {
      await interaction.reply({embeds: [createErrorEmbed(
        `Error updating ${player.username}#${player.discriminator}.`, 
        `${primary} and ${secondary} are not valid roles.`
      )]});
    } else if (!roles.includes(primary)) {
      await interaction.reply({embeds: [createErrorEmbed(
        `Error updating ${player.username}#${player.discriminator}.`, 
        `${primary} is not a valid role.`
      )]});
    } else if (!roles.includes(secondary)) {
      await interaction.reply({embeds: [createErrorEmbed(
        `Error updating ${player.username}#${player.discriminator}.`, 
        `${secondary} is not a valid role.`
      )]});
    } else {
      const playerInfo = db.getPlayer(dbPath, player.id, 'discordid');
      playerInfo.then(async id => {
        if (!id) {
          await interaction.reply({embeds: [createErrorEmbed(
            `Error updating ${player.username}#${player.discriminator}.`, 
            `Player is not registered.`
          )]});
        } else {
          try {
            if (primary) {
              db.modifyPlayer(dbPath, player.id, 'primaryrole', roles.indexOf(primary));
            }
            if (secondary) {
              db.modifyPlayer(dbPath, player.id, 'secondaryrole', roles.indexOf(secondary));
            }
            await interaction.reply({embeds: [createRoleEmbed(player, primary, secondary)]});
          } catch (err) {
            await interaction.reply({embeds: [createErrorEmbed(
              `Error updating ${player.username}#${player.discriminator}.`, 
              `Error occurred while updating database.`
            )]});
            console.log(err);
          }
        }
      });
    }
  }
};