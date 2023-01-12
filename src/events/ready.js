const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Not Clash v2 bot ready! Logged in as ${client.user.tag}.`);
	},
};
