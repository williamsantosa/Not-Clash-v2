const { Events } = require('discord.js');
const { v4: uuidv4 } = require('uuid');

const { dbPath } = require('../misc/constants');
const { createMatchEmbed, createErrorEmbed } = require('../misc/embeds');
const st = require('../../backend/statistics');
const db = require('../../backend/database');

const wait = require('node:timers/promises').setTimeout;

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		// Execute UserSelectMenu
		if (interaction.isUserSelectMenu()) {

			// Command: selectUsers 
			if (interaction.customId === 'selectUsers') {
				if (interaction.values.length !== 10) {
					await interaction.reply({embeds: createErrorEmbed('Invalid number of users.', `Selected ${interactions.values.length} users.`)});
					console.log('Replied with error.\nInvalid number of users.');
					return;
				}

				// State that bot is processing
				await interaction.deferReply();

				// Run queries for each of the players
				const playersInfo = [];
				console.log('Grabbing player information...')
				for (let i = 0; i < interaction.values.length; i++) {
					playersInfo.push(db.getAllPlayer(dbPath, interaction.values[i]));
				}
				console.log('Finished grab.');

				// Once queries are processed, check if player exists
				// If not, register player and get their updated values
				Promise.all(playersInfo)
					.then(async res => {
						for (const [i, player] of res.entries()) {
							if (!player) {
								console.log(`Registering ${interaction.values[i]}...`);
								db.registerPlayer(dbPath, interaction.values[i]);
								await wait(2000);
								console.log('Finished register.');
								const id = interaction.values[i];
								res[i] = await db.getAllPlayer(dbPath, id);
							};
						}
						return res;
					})
					.then(async res => {
						Promise.all(res)
							.then(async playersInfo => {
								// Sort teams
								console.log('Sorting teams...');
								const teams = st.leagueSort(playersInfo);
								for (const t of ['0', '1']) {
									teams[t] = teams[t].sort(player => player.role);
								}
								console.log('Finished sort.');

								// Register match
								const matchid = uuidv4();
								const ids = [];
								for (const t of ['0', '1']) {
									teams[t].forEach(e => ids.push(e.player.discordid));
								}
								console.log('Registering match...')
								db.registerMatch(dbPath, matchid, ids);
								console.log('Finished register.')

								// Reply
								await interaction.editReply({
									ephemeral: false,
									embeds: [createMatchEmbed(teams, matchid)],
									components: [],
								});
								console.log(`Responded with createMatchEmbed(${teams}, ${matchid}).`);
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
