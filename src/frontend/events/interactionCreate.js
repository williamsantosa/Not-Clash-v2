const { Events } = require('discord.js');
const { createLeaderboardComponents } = require('../misc/components');
const { createLeaderboardEmbed } = require('../misc/embeds');
const wait = require('node:timers/promises').setTimeout;
const db = require('../../backend/database');
const { dbPath } = require('../misc/constants');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// Execute left and right on leaderboard
		if (interaction.isButton()) {
			// https://discordjs.guide/interactions/select-menus.html#building-and-sending-select-menus
			// To get a command, make it so there is a command called 'start' in commands folder,
			// add data but do not make it execute anything. Then follow the guide above to make it
			// actually reply to the message.

			if (interaction.commandName === 'start') {
				
			}
		}

		// Execute slash commands
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}. Error message below.`);
				console.error(error);
			}
		}
	},
};
