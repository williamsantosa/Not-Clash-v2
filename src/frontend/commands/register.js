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
    const player = (interaction.options.getUser('player')) ? interaction.options.getUser('player') : interaction.user;
    let primary = interaction.options.getString('primary');
    let secondary = interaction.options.getString('secondary');
    if (primary) primary = primary.toLowerCase();
    if (secondary) secondary = secondary.toLowerCase();
    
    if (!roles.includes(primary) && !roles.includes(secondary)) {
      await interaction.reply({embeds: [createErrorEmbed(
        `Error registering ${player.username}#${player.discriminator}.`, 
        `${primary} and ${secondary} are not valid roles.`
      )]});
    } else if (!roles.includes(primary)) {
      await interaction.reply({embeds: [createErrorEmbed(
        `Error registering ${player.username}#${player.discriminator}.`, 
        `${primary} is not a valid role.`
      )]});
    } else if (!roles.includes(secondary)) {
      await interaction.reply({embeds: [createErrorEmbed(
        `Error registering ${player.username}#${player.discriminator}.`, 
        `${secondary} is not a valid role.`
      )]});
    } else {
      const playerInfo = db.getPlayer(dbPath, player.id, 'discordid');
      playerInfo.then(async id => {
        if (id) {
          await interaction.reply({embeds: [createErrorEmbed(
            `Error registering ${player.username}#${player.discriminator}.`, 
            `Player is already registered.`
          )]});
        } else {
          try {
            db.registerPlayer(dbPath, player.id);
            await interaction.reply({embeds: [createRegisterEmbed(player, primary, secondary)]});
          } catch (err) {
            await interaction.reply({embeds: [createErrorEmbed(
              `Error registering ${player.username}#${player.discriminator}.`, 
              `Error occurred while registering player to database.`
            )]});
            console.log(err);
          }
        }
      });
    }
  },
};