const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { color } = require('../misc/constants.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Information about the Not Clash v2 bot.'),
  async execute(interaction) {
    await interaction.reply({
      embeds: [new EmbedBuilder()
        .setColor(color.orange)
        .setTitle('Not Clash v2')
        .setURL('https://github.com/williamsantosa/Not-Clash-v2')
        .setAuthor({name: 'William Santosa (ancanis#0715)', url: 'https://github.com/williamsantosa'})
        .setDescription('Discord bot that facilitates League of Legends custom matches.')
      ],
      components: [new ActionRowBuilder()
        .addComponents(new ButtonBuilder()
          .setLabel('Repository Link')
          .setStyle(ButtonStyle.Link)
          .setURL('https://github.com/williamsantosa/Not-Clash-v2')
        )
      ]
    });
  },
};
