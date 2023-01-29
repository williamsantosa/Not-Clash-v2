const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { color } = require('../misc/constants');
const { createErrorEmbed } = require('../misc/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help message for Not Clash v2 bot.')
    .addStringOption(option => 
      option.setName('command')
				.setDescription('Returns information about a specific command.')
        .setRequired(true)),
  async execute(interaction) {
    // Grab all the command files from the commands directory you created earlier
    const commands = [];
    const commandsPath = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const commandPath = path.join(__dirname, file);
      const command = require(commandPath);
      commands.push(command.data.toJSON());
    }

    const command = interaction.options.getString('command');
    const data = commands.find(e => e.name === command.trim());

    // Error check
    if (!data) {
      await interaction.reply({embeds: [createErrorEmbed('Invalid command.', `Command supplied: ${command}`)]});
      console.log(`Replied with error.\nInvalid command: ${command}`);
      return;
    }

    // Build return embed
    const retVal = new EmbedBuilder()
      .setColor(color.orange)
      .setDescription(data.description)
      .setTitle(data.name)
      .setTimestamp();
  
    let usage = `\`${data.name}`;

    const options = [];
    for (let option of data.options) {
      usage += (option.required) ? ` ${option.name}` : ` [${option.name}]`;
      options.push(
        { name: option.name, value: option.description},
      );
    }

    retVal.addFields(
      { name: 'Usage', value: usage + `\``},
      ...options
    );

    // Reply
    await interaction.reply({embeds: [retVal]});
    console.log(`Responded with help embed for command: ${command}.`);
  },
};