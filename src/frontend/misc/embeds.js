const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const color = {
  blue: 0x0099FF,
  red: 0xFF9900,
  green: 0x49FF49,
  orange: 0xE67E22,
};

const createRollEmbed = (text1, text2, color) => {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(text1)
    .setDescription(text2);
}

module.exports = {
  color: color,
  createRollEmbed: (text1, text2, color) => createRollEmbed(text1, text2, color),
};