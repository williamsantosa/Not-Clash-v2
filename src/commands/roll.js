const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Returns a random number from 1 to number1 iff only number1. Otherwise, from number1 to number2.')
		.addNumberOption(option => 
			option.setName('number1')
				.setDescription('First number inputted.')
				.setRequired(true))
		.addNumberOption(option => 
			option.setName('number2')
				.setDescription('Second number inputted.')),
	async execute(interaction) {
		const number1 = interaction.options.getNumber('number1');
		const number2 = interaction.options.getNumber('number2');
		if (!number2) {
			if (!number1) {
				await interaction.reply(`Invalid input. No values supplied.`);
			}
			const val = Math.ceil(Math.random() * number1);
			await interaction.reply(`${val}`);
		} else if (number1 > number2) {
			await interaction.reply(`Invalid input. ${number1} > ${number2}`);
		} else if (number1 && number2) {
			const val = Math.floor(Math.random() * (number2 - number1 + 1) ) + number1;
			await interaction.reply(`${val}`);
		}
	},
};
