const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ActionRow } = require('discord.js');

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
  return new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('selectStartOptions')
        .setPlaceholder('No selection')
        .addOptions(
          {
            label: 'Random',
            description: 'Sorts players randomly into a team.',
            value: 'random'
          },
          {
            label: 'Elo',
            description: 'Sorts players by Elo.',
            value: 'elo'
          },
          {
            label: 'Role',
            description: 'Sorts players by role.',
            value: 'role'
          }
        )
    )
}

module.exports = {
  createLeaderboardComponents: () => createLeaderboardComponents(),
  createStartSelectComponent: () => createStartSelectComponent()
};