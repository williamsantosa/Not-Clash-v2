const { SlashCommandBuilder } = require('discord.js');
const { createRollEmbed, color } = require('../misc/embeds.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Random number from 1 to n1 or from n1 to n2, inclusive.')
		.addNumberOption(option => 
			option.setName('n1')
				.setDescription('First number.')
				.setRequired(true))
		.addNumberOption(option => 
			option.setName('n2')
				.setDescription('Second number.')),
	async execute(interaction) {
		const n1 = interaction.options.getNumber('n1');
		const n2 = interaction.options.getNumber('n2');
		if (!n2) {
			if (!n1) {
				await interaction.reply({embeds: [createRollEmbed(
					'Invalid input. No values supplied.', 
					`Generated from using values n1 = ${n1} and n2 = ${n2}`,
					color.red,
				)]});
			}
			const val = Math.ceil(Math.random() * n1);
			await interaction.reply({embeds: [createRollEmbed(
				`Rolled ${val}`,
				`Generated from using values n1 = ${n1} and n2 = ${n2}`,
				color.blue,
			)]});
		} else if (n1 > n2) {
			await interaction.reply({embeds: [createRollEmbed(
				`Invalid input. ${n1} > ${n2}`,
				`Generated from using values n1 = ${n1} and n2 = ${n2}`,
				color.blue,
			)]});
		} else {
			const val = Math.floor(Math.random() * (n2 - n1 + 1) ) + n1;
			await interaction.reply({embeds: [createRollEmbed(
				`Rolled ${val}`,
				`Generated from using values n1 = ${n1} and n2 = ${n2}`,
				color.blue,
			)]});
		}
	},
};
