const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { color } = require('../misc/constants');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('commands')
    .setDescription('Information about all commands in Not Clash v2 bot.'),
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

    const retVal = new EmbedBuilder()
      .setColor(color.orange)
      .setTitle(`Command List`)
      .setDescription('Command list with name and description. Run \`help command_name\` to get full description.')
      .setTimestamp();

    for (let data of commands) {
      retVal.addFields(
        { name: data.name, value: data.description}
      );
    }

    await interaction.reply({embeds: [retVal]});
    console.log('Responded with list of commands embed.');
  },
};