const { EmbedBuilder } = require('discord.js');

const { color, roles } = require('./constants.js');

const createErrorEmbed = (text1, text2) => {
  return new EmbedBuilder()
    .setColor(color.red)
    .setTitle(text1)
    .setDescription(text2);
}

const createRollEmbed = (text1, text2, color) => {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(text1)
    .setDescription(text2)
    .setTimestamp();
}

const createRegisterEmbed = (player, role1, role2) => {
  const retVal = new EmbedBuilder()
    .setColor(color.blue)
    .setTitle(`Succesfully registered ${player.username}#${player.discriminator}!`)
    .setTimestamp()
    .setFooter({text: `Registered id: ${player.id}`});
  if (role1 && role2) {
    retVal.setDescription(`Set primary role to ${role1} and secondary role to ${role2}.`);
  } else if (role1) {
    retVal.setDescription(`Set primary role to ${role1}.`);
  } else if (role2) {
    retVal.setDescription(`Set secondary role to ${role2}.`);
  }
  return retVal;
}

const createRoleEmbed = (player, role1, role2) => {
  const retVal = new EmbedBuilder()
    .setColor(color.blue)
    .setTitle(`Succesfully set roles for ${player.username}#${player.discriminator}.`)
    .setTimestamp()
    .setFooter({text: `Roles set for id: ${player.id}`});
  if (role1 && role2) {
    retVal.setDescription(`Set primary role to ${role1} and secondary role to ${role2}.`);
  } else if (role1) {
    retVal.setDescription(`Set primary role to ${role1}.`);
  } else if (role2) {
    retVal.setDescription(`Set secondary role to ${role2}.`);
  }
  return retVal;
}

const createStatsEmbed = (id, elo, wins, games, primaryrole, secondaryrole) => {
  return new EmbedBuilder()
    .setColor(color.orange)
    .setTitle('Stats')
    .setDescription(`Stats for <@${id}>`)
    .addFields(
      { name: 'Elo', value: `${elo}`},
      { name: 'Wins', value: `${wins} (${Math.round(wins * 100/games)}%)`},
      { name: 'Total Games', value: `${games}`},
      { name: 'Primary Role', value: `${roles[primaryrole].charAt(0).toUpperCase() + roles[primaryrole].slice(1)}`},
      { name: 'Secondary Role', value: `${roles[secondaryrole].charAt(0).toUpperCase() + roles[secondaryrole].slice(1)}`},
    )
    .setTimestamp()
    .setFooter({text: `Statistics for id: ${id}`})
};

const createLeaderboardEmbed = (players, start, end) => {
  const retVal = new EmbedBuilder()
    .setColor(color.orange)
    .setTitle(`Leaderboard`)
    .setTimestamp()
    .setFooter({text: `Statistics for rank ${start+1} - ${end}`});
  for (let i = start; i < end; i++) {
    const player = players[i];
    retVal.addFields(
      {name: `Rank ${i+1}`, value: `<@${player.discordid}>`, inline: true},
      {name: `Elo`, value: `${player.elo} / ${player.wins} (${Math.round(player.wins * 100/player.games)}%)`, inline: true},
      {name: `Primary Role`, value: `${roles[player.primaryrole].charAt(0).toUpperCase() + roles[player.primaryrole].slice(1)}`, inline: true}
    );
  }
  return retVal;
};

module.exports = {
  createErrorEmbed: (text1, text2) => createErrorEmbed(text1, text2),
  createRollEmbed: (text1, text2, color) => createRollEmbed(text1, text2, color),
  createRegisterEmbed: (playerid, role1, role2) => createRegisterEmbed(playerid, role1, role2),
  createRoleEmbed: (player, role1, role2) => createRoleEmbed(player, role1, role2),
  createStatsEmbed: (id, elo, wins, games, primaryrole, secondaryrole) => createStatsEmbed(id, elo, wins, games, primaryrole, secondaryrole),
  createLeaderboardEmbed: (players, start, end) => createLeaderboardEmbed(players, start, end)
};