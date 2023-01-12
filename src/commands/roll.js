const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Random number from 1 to n1 or from n1 to n2.')
		.addNumberOption(option => 
			option.setName('n1')
				.setDescription('First number inputted.')
				.setRequired(true))
		.addNumberOption(option => 
			option.setName('n2')
				.setDescription('Second number inputted.')),
	async execute(interaction) {
		const n1 = interaction.options.getNumber('n1');
		const n2 = interaction.options.getNumber('n2');
		if (!n2) {
			if (!n1) {
				await interaction.reply(`Invalid input. No values supplied.`);
			}
			const val = Math.ceil(Math.random() * n1);
			await interaction.reply(`${val}`);
		} else if (n1 > n2) {
			await interaction.reply(`Invalid input. ${n1} > ${n2}`);
		} else if (n1 && n2) {
			const val = Math.floor(Math.random() * (n2 - n1 + 1) ) + n1;
			await interaction.reply(`${val}`);
		}
	},
};
