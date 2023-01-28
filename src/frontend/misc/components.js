const { ActionRowBuilder, ButtonBuilder, ButtonStyle, UserSelectMenuBuilder } = require('discord.js');

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

const createStartSelectComponent = () => {
  return [
    new ActionRowBuilder()
      .addComponents(
        new UserSelectMenuBuilder()
          .setCustomId('selectUsers')
          .setPlaceholder('Select users')
          .setMinValues(10)
          .setMaxValues(10)
      )
  ];
}

module.exports = {
  createLeaderboardComponents: () => createLeaderboardComponents(),
  createStartSelectComponent: () => createStartSelectComponent()
};