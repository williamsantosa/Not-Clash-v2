const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// Execute left and right on leaderboard

		const filter = i => i.customId === 'left';
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
		collector.on('collect', async i => {
			await i.update({ content: 'A button was clicked!', components: [] });
		});
		collector.on('end', collected => console.log(`Collected ${collected.size} items`));

		// Execute slash commands

		if (!interaction.isChatInputCommand()) return;

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
	},
};
