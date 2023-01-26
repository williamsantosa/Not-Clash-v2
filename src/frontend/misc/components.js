const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const createLeaderboardComponents = () => {
  return new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('left')
        .setLabel('Left')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('right')
        .setLabel('Right')
        .setStyle(ButtonStyle.Primary)
    );
}
module.exports = {
  createLeaderboardComponents: () => createLeaderboardComponents()
};