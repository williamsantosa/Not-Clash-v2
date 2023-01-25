const { EmbedBuilder } = require('discord.js');

const color = {
  blue: 0x0099FF,
  red: 0xFF0000,
  green: 0x49FF49,
  orange: 0xE67E22,
};

const createErrorEmbed = (text1, text2) => {
  return new EmbedBuilder()
    .setColor(color.red)
    .setTitle(text1)
    .setDescription(text2);
}

const createRollEmbed = (text1, text2, color) => {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(text1)
    .setDescription(text2);
}

const createRegisterEmbed = (player, role1, role2) => {
  const retVal = new EmbedBuilder()
    .setColor(color.blue)
    .setTitle(`Succesfully registered ${player.username}#${player.discriminator}!`);
  if (role1 && role2) {
    retVal.setDescription(`Set primary role to ${role1} and secondary role to ${role2}.`);
  } else if (role1) {
    retVal.setDescription(`Set primary role to ${role1}.`);
  } else if (role2) {
    retVal.setDescription(`Set secondary role to ${role2}.`);
  }
  return retVal;
}

module.exports = {
  color: color,
  createErrorEmbed: (text1, text2) => createErrorEmbed(text1, text2),
  createRollEmbed: (text1, text2, color) => createRollEmbed(text1, text2, color),
  createRegisterEmbed: (playerid, role1, role2) => createRegisterEmbed(playerid, role1, role2),
};