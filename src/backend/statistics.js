// Probability functions

/**
 * Returns the probability of t0 winning
 * @param {*} t0 Rating of team 0
 * @param {*} t1 Rating of team 1
 * @param {*} D  Effect of difference on probability to win or lose (higher = less effect)
 */
const probabilityWinning = (t0, t1, D) => {
  return 1 / (1 + Math.pow(10, (t1 - t0) / D));
};

/**
 * Returns the confidence level that a player is in their Elo
 * @param {Number} n Number of games played
 * @returns {Number} Confidence percent
 */
const pConfidence = (n) => {
  return 1 - Math.pow(Math.exp(1), -0.1 * n);
};

/**
 * Returns the Elo rating from results of the game
 * @param {Number} t0 Rating of team0
 * @param {Number} t1 Rating of team1
 * @param {Number} D Effect of difference on probability to win/lose (higher = less effect)
 * @param {Number} K Maximum value rating can change difference
 * @param {Number} w 0 or 1, team0 or team1 wins
 * @returns {Number} Updated ratings (team0 rating, team1 rating)
 */
const eloRating = (t0, t1, D, K, w) => {
  // wp = 0 if w == 1 else 1
  // p1, p2 = prob(r1, r2, D), prob(r2, r1, D)
  // rv1 = float(r1) + float(K) * (wp - p1)
  // rv2 = float(r2) + float(K) * (wp - p2)
  // return (int(rv1), int(rv2))
  const wp = (w === 0) ? 0 : 1;
  const p0 = probabilityWinning(t0, t1, D);
  const p1 = probabilityWinning(t1, t0, D);
  const rv0 = t0 + K * (wp - p0);
  const rv1 = t1 + K * (wp - p1);
  return [rv0, rv1];
};

/**
 * Returns an object with teams number from 0 to n - 1
 * @param {Number} n 
 * @returns {Object}
 */
const generateTeams = (n) => {
  const teams = {};
  for (let i = 0; i < n; i++) {
    teams[`${i}`] = [];
  }
  return teams;
};

/**
 * Returns count of rows
 * @param {Array} players 
 * @returns {Array}
 */
const countRoles = (players) => {
  const countPrimaryRoles = {};
  const countSecondaryRoles = {};
  for (let i = 0; i < 5; i++) {
    countPrimaryRoles[`${i}`] = 0;
    countSecondaryRoles[`${i}`] = 0;
  }
  for (const player of players) {
    countPrimaryRoles[`${player.primaryrole}`] += 1;
    countSecondaryRoles[`${player.secondaryrole}`] += 1;
  }
  return [countPrimaryRoles, countSecondaryRoles];
}

/**
 * Returns teams with players
 * @param {Array} players List containing players
 * @param {Number} n Number of teams 
 * @returns {Object} {team# : [player]}
 */
const teamSort = (players, n) => {
  const teams = generateTeams(n);
  for (const [i, player] of players.entries()) {
    teams[`${i % n}`].push(player);
  }
  return teams;
};

/**
 * Returns teams with players and their roles
 * @param {Array} players List containing player objec ts 
 * @param {String} option Option of what kind of sort they do 
 */
const leagueSort = (players, option='') => {
  if (players.length !== 10) return;

  const teams = generateTeams(2);
  if (option === 'elo') {
    const sortedPlayers = players.sort(player => player.elo);
    const roles0 = [0,1,2,3,4].sort(() => Math.random() - 0.5);
    const roles1 = [0,1,2,3,4].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 10; i += 2) {
      const player0 = sortedPlayers[`${i}`];
      const player1 = sortedPlayers[`${i+1}`];
      teams['0'].push({
        player: player0, 
        role: roles0[Math.floor(i/2)], 
      });
      teams['1'].push({
        player: player1, 
        role: roles1[Math.floor(i/2)], 
      });
    }
  } else if (option === 'role') {
    const sortedPlayers = players.sort(player => player.elo);
    const roles = {
      '0': [false, false, false, false, false], 
      '1': [false, false, false, false, false],
    }
    
    let currTeam = 0;
    for (const [i, player] of sortedPlayers.entries()) {
      if (!player.primaryrole || roles[`${currTeam}`][player.primaryrole]) {
        i = (i + 1) % player.length;
        continue;
      }

      teams[`${currTeam}`].push({
        player: player,
        role: player.primaryrole,
      });
      
      sortedPlayers.splice(i, 1);
      roles[`${currTeam}`][player.primaryrole] = true;
      currTeam = (currTeam === 1) ? 0 : 1;
    }

    for (const [i, player] of sortedPlayers.entries()) {
      if (!player.secondaryrole || roles[`${currTeam}`][player.secondaryrole]) {
        i = (i + 1) % player.length;
        continue;
      }

      teams[`${currTeam}`].push({
        player: player,
        role: player.secondaryrole,
      });
      
      sortedPlayers.splice(i, 1);
      roles[`${currTeam}`][player.secondaryrole] = true;
      currTeam = (currTeam === 1) ? 0 : 1;
    }

    while (sortedPlayers.length > 0) {
      const player = sortedPlayers[0];
      if (teams[`${currTeam}`].length < 5) {
        const currrole = roles[`${currTeam}`].findIndex(e => e === true);
        teams[`${currTeam}`].push({
          player: player,
          role: currrole,
        });
        sortedPlayers.splice(0, 1);
      }
      currTeam = (currTeam === 1) ? 0 : 1;
    }
  } else { // randomly assign
    const shuffledPlayers = players.sort(() => Math.random() - 0.5);
    for (const [i, player] of shuffledPlayers.entries()) {
      teams[`${i % 2}`].push({
        player: player, 
        role: Math.floor(i / 2), 
      });
    }
  }
  return teams;
};

module.exports = {
  probabilityWinning: (t0, t1, D) => probabilityWinning(t0, t1, D),
  pConfidence: (n) => pConfidence(n),
  eloRating: (t0, t1, D, K, w) => eloRating(t0, t1, D, K, w),
  teamSort: (players, n) => teamSort(players, n),
  leagueSort: (players, option) => leagueSort(players, option),
};