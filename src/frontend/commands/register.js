const { SlashCommandBuilder } = require('discord.js');
const { createRegisterEmbed, createErrorEmbed } = require('../misc/embeds.js');
const { roles, dbPath } = require('../misc/constants.js');

const db = require('../../backend/database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Registers player to the database.')
    .addUserOption(option => 
      option.setName('player')
        .setDescription('Player to register.'))
    .addStringOption(option =>
      option.setName('primary')
        .setDescription('Sets the primary role for the player.'))
    .addStringOption(option =>
      option.setName('secondary')
        .setDescription('Sets the secondary role for the player.')),
  async execute(interaction) {
    // Grab player, primary role, secondary role
    const player = (interaction.options.getUser('player')) ? interaction.options.getUser('player') : interaction.user;
    let primary = interaction.options.getString('primary');
    let secondary = interaction.options.getString('secondary');
    if (primary) primary = primary.toLowerCase();
    if (secondary) secondary = secondary.toLowerCase();
    
    // Error check
    if (!roles.includes(primary) && !roles.includes(secondary)) {
      await interaction.reply({embeds: [createErrorEmbed(
        `Error registering ${player.username}#${player.discriminator}.`, 
        `${primary} and ${secondary} are not valid roles.`
      )]});
      console.log(`Responded with error.\nInvalid roles: ${primary} and ${secondary}.`);
    } else if (!roles.includes(primary)) {
      await interaction.reply({embeds: [createErrorEmbed(
        `Error registering ${player.username}#${player.discriminator}.`, 
        `${primary} is not a valid role.`
      )]});
      console.log(`Responded with error.\nInvalid role: ${primary}.`);
    } else if (!roles.includes(secondary)) {
      await interaction.reply({embeds: [createErrorEmbed(
        `Error registering ${player.username}#${player.discriminator}.`, 
        `${secondary} is not a valid role.`
      )]});
      console.log(`Responded with error.\nInvalid role: ${secondary}.`);
    } else {
      // Get player information
      const playerInfo = db.getPlayer(dbPath, player.id, 'discordid');
      playerInfo.then(async id => {
        if (id) {
          // Check if already registered
          await interaction.reply({embeds: [createErrorEmbed(
            `Error registering ${player.username}#${player.discriminator}.`, 
            `Player is already registered.`
          )]});
          console.log(`Responded with error.\nPlayer ${player.username}#${player.discriminator} already registered.`);
        } else {
          // Register player
          try {
            console.log(`Registering ${player.id}...`);
            db.registerPlayer(dbPath, player.id);
            console.log(`Finished register.`);
            await interaction.reply({embeds: [createRegisterEmbed(player, primary, secondary)]});
            console.log(`Responded with createRegisterEmbed(${player}, ${primary}, ${secondary}).`);
          } catch (err) {
            await interaction.reply({embeds: [createErrorEmbed(
              `Error registering ${player.username}#${player.discriminator}.`, 
              `Error occurred while registering player to database.`
            )]});
            console.log(`Responded with error.\nInternal server error.`);
            console.log(err);
          }
        }
      });
    }
  },
};