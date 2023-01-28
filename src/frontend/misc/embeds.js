const { EmbedBuilder, Embed } = require('discord.js');
const { color, roles } = require('./constants.js');
const st = require('../../backend/statistics');
const { D } = require('../../../config.json');

const createErrorEmbed = (text1, text2) => {
  return new EmbedBuilder()
    .setColor(color.red)
    .setTitle(text1)
    .setDescription(text2);
}

const createRollEmbed = (text1, text2, color) => {
  return new EmbedBuilder()
    .setColor(color.green)
    .setTitle(text1)
    .setDescription(text2)
    .setTimestamp();
}

const createRegisterEmbed = (player, role1, role2) => {
  const retVal = new EmbedBuilder()
    .setColor(color.green)
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
    .setColor(color.green)
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
      { name: 'Elo', value: `${Math.round(elo)}`},
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

const createStartSelectEmbed = () => {
  return new EmbedBuilder()
    .setColor(color.blue)
    .setTitle('Select Menu')
    .setDescription('Select 10 users to play in the match below.');
};

const createMatchEmbed = (teams, matchid) => {
  let desc1 = '';
  let desc2 = '';
  for (let i = 0; i < 5; i++) {
    const role = `${roles[i].charAt(0).toUpperCase() + roles[i].slice(1)}`;
    const p1 = `<@${teams['0'][i].player.discordid}>`;
    const p2 = `<@${teams['1'][i].player.discordid}>`;
    desc1 += `${role}: ${p1}\n`;
    desc2 += `${role}: ${p2}\n`;
  }

  const team1elo = Math.round(teams['0'].reduce((partialSum, e) => partialSum + e.player.elo, 0) / 5);
  const team2elo = Math.round(teams['1'].reduce((partialSum, e) => partialSum + e.player.elo, 0) / 5);
  return new EmbedBuilder()
    .setColor(color.orange)
    .addFields(
      {
        name: `Team 1 (${team1elo} / ${Math.round(st.probabilityWinning(team1elo, team2elo, D) * 100)}%)\n`,
        value: desc1,
      },
      {
        name: `Team 2 (${team2elo} / ${Math.round(st.probabilityWinning(team2elo, team1elo, D) * 100)}%)\n`,
        value: desc2,
      },
    )
    .setTimestamp()
    .setFooter({text: `${matchid}`});
};

const createFinishEmbed = (matchid, team1, team2, diff1, diff2, winteam) => {
  let desc1 = '';
  let desc2 = '';
  for (let i = 0; i < 5; i++) {
    const role = `${roles[i].charAt(0).toUpperCase() + roles[i].slice(1)}`;
    const p1 = `<@${team1[i].discordid}>`;
    const p2 = `<@${team2[i].discordid}>`;
    desc1 += `${role}: ${p1}\n`;
    desc2 += `${role}: ${p2}\n`;
  }

  const retVal = new EmbedBuilder()
    .setColor(color.green)
    .setTitle(`Updated Match`)
    .addFields(
      {
        name: `Team 1 (${(winteam === 0) ? '+' : '-'}${Math.round(diff1)})`,
        value: desc1,
      },
      {
        name: `Team 2 (${(winteam === 1) ? '+' : '-'}${Math.round(diff2)})`,
        value: desc2,
      },
    )
    .setTimestamp()
    .setFooter({text: `${matchid}`});
  return retVal;
};

const createDeleteMatchEmbed = (matchid) => {
  return new EmbedBuilder()
    .setColor(color.green)
    .setTitle(`Cancelled Match`)
    .setDescription(`Cancelled match <${matchid}> succesfully.`)
    .setTimestamp()
    .setFooter({text: `${matchid}`});
};

module.exports = {
  createErrorEmbed: (text1, text2) => createErrorEmbed(text1, text2),
  createRollEmbed: (text1, text2, color) => createRollEmbed(text1, text2, color),
  createRegisterEmbed: (playerid, role1, role2) => createRegisterEmbed(playerid, role1, role2),
  createRoleEmbed: (player, role1, role2) => createRoleEmbed(player, role1, role2),
  createStatsEmbed: (id, elo, wins, games, primaryrole, secondaryrole) => createStatsEmbed(id, elo, wins, games, primaryrole, secondaryrole),
  createLeaderboardEmbed: (players, start, end) => createLeaderboardEmbed(players, start, end),
  createStartSelectEmbed: () => createStartSelectEmbed(),
  createMatchEmbed: (teams, matchid) => createMatchEmbed(teams, matchid),
  createFinishEmbed: (matchid, team1, team2, diff1, diff2, winteam) => createFinishEmbed(matchid, team1, team2, diff1, diff2, winteam),
  createDeleteMatchEmbed: (matchid) => createDeleteMatchEmbed(matchid)
};