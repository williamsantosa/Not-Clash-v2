const { Events } = require('discord.js');
const database = require('../backend/database.js');
const { existsSync } = require('node:fs');
const { normalize } = require('node:path');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		const dbPath = normalize('./src/backend/data.db');
		if (!existsSync(dbPath)) {
			database.createDB(dbPath);
		}
		console.log(`Not Clash v2 bot ready! Logged in as "${client.user.tag}".`);
	},
};
