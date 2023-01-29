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
    // Grab player, primary role, secondary role
    const player = interaction.user;
    let primary = interaction.options.getString('primary');
    let secondary = interaction.options.getString('secondary');
    if (primary) primary = primary.toLowerCase();
    if (secondary) secondary = secondary.toLowerCase();

    // Error check
    if (!roles.includes(primary) && !roles.includes(secondary)) {
      await interaction.reply({embeds: [createErrorEmbed(
        `Error updating ${player.username}#${player.discriminator}.`, 
        `${primary} and ${secondary} are not valid roles.`
      )]});
      console.log(`Responded with error.\nInvalid roles: ${primary} and ${secondary}.`);
    } else if (!roles.includes(primary)) {
      await interaction.reply({embeds: [createErrorEmbed(
        `Error updating ${player.username}#${player.discriminator}.`, 
        `${primary} is not a valid role.`
      )]});
      console.log(`Responded with error.\nInvalid role: ${primary}.`);
    } else if (!roles.includes(secondary)) {
      await interaction.reply({embeds: [createErrorEmbed(
        `Error updating ${player.username}#${player.discriminator}.`, 
        `${secondary} is not a valid role.`
      )]});
      console.log(`Responded with error.\nInvalid role: ${secondary}.`);
    } else {
      // Get player information
      const playerInfo = db.getPlayer(dbPath, player.id, 'discordid');
      playerInfo.then(async id => {
        if (!id) {
          await interaction.reply({embeds: [createErrorEmbed(
            `Error updating ${player.username}#${player.discriminator}.`, 
            `Player is not registered.`
          )]});
          console.log(`Responded with error.\nPlayer ${player.username}#${player.discriminator} not registered.`);
        } else {
          // Update player roles
          try {
            console.log(`Updating roles...`);
            if (primary) {
              db.modifyPlayer(dbPath, player.id, 'primaryrole', roles.indexOf(primary));
            }
            if (secondary) {
              db.modifyPlayer(dbPath, player.id, 'secondaryrole', roles.indexOf(secondary));
            }
            console.log('Finished update.');
            await interaction.reply({embeds: [createRoleEmbed(player, primary, secondary)]});
            console.log(`Responded with createRoleEmbed(${player}, ${primary}, ${secondary}).`);
          } catch (err) {
            await interaction.reply({embeds: [createErrorEmbed(
              `Error updating ${player.username}#${player.discriminator}.`, 
              `Error occurred while updating database.`
            )]});
            console.log(`Responded with error.\nInternal server error.`);
            console.log(err);
          }
        }
      });
    }
  }
};