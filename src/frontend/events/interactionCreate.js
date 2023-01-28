const { Events } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const db = require('../../backend/database');
const { dbPath } = require('../misc/constants');
const { createMatchEmbed } = require('../misc/embeds');
const { v4: uuidv4 } = require('uuid');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// Execute left and right on leaderboard
		if (interaction.isUserSelectMenu()) {
			// https://discordjs.guide/interactions/select-menus.html#building-and-sending-select-menus
			// To get a command, make it so there is a command called 'start' in commands folder,
			// add data but do not make it execute anything. Then follow the guide above to make it
			// actually reply to the message.

			if (interaction.customId === 'selectUsers') {
				const playersInfo = [];
				for (let i = 0; i < interaction.values.length; i++) {
					playersInfo.push(db.getAllPlayer(dbPath, interaction.values[i]));
				}
				Promise.all(playersInfo)
					.then(async res => {
						for (const [i, player] of res.entries()) {
							if (!player) {
								db.registerPlayer(dbPath, interaction.values[i]);
								await wait(500);
								const id = interaction.values[i];
								res[i] = await db.getAllPlayer(dbPath, id);
							};
						}
						return res;
					})
					.then(async res => {
						Promise.all(res)
							.then(async playersInfo => {
								const matchid = uuidv4();
								await interaction.reply({
									ephemeral: false,
									embeds: [createMatchEmbed(playersInfo, matchid)],
									components: [],
								});
							});
					});
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
