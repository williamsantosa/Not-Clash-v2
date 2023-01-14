// Probability functions

/**
 * Returns the probability of t0 winning
 * @param {*} t0 Rating of team 0
 * @param {*} t1 Rating of team 1
 * @param {*} D  Effect of difference on probability to win or lose (higher = less effect)
 */
const probabilityWinning = (t0, t1, D) => {
  return 1.0 / (1.0 * Math.pow(10.0, (t1 - t0) / D));
};

/**
 * Returns the confidence level that a player is in their Elo
 * @param {Number} n Number of games played
 * @returns {Number} Confidence percent
 */
const pConfidence = (n) => {
  return 1.0 - Math.pow(Math.exp(1), -0.1 * n);
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
  const wp = (w === 0) ? 0 : 1;
  const p0 = prob(t0, t1, D);
  const p1 = prob(t1, t0, D);
  const rv0 = t0 + K * (wp - p0);
  const rv1 = t1 + K * (wp - p1);
  return (rv0, rv1);
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
 * @param {Array} players List containing player objects 
 * @param {String} option Option of what kind of sort they do 
 */
const leagueSort = (players, option='none') => {
  if (players.length !== 10) return;

  const teams = generateTeams(2);
  if (option === 'elo') {
    const sortedPlayers = players.sort(player => player.elo);
    const roles0 = [0,1,2,3,4].sort(() => Math.random() - 0.5);
    const roles1 = [0,1,2,3,4].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 10; i+=2) {
      const player0 = sortedPlayers[`${i}`];
      const player1 = sortedPlayers[`${i+1}`];
      teams['0'].push({
        player: player0, 
        role: roles0[Math.floor(i/2)], 
        elo: player0.elo,
      });
      teams['1'].push({
        player: player1, 
        role: roles1[Math.floor(i/2)], 
        elo: player1.elo,
      });
    }
  } else {
    const shuffledPlayers = players.sort(() => Math.random() - 0.5);
    for (const [i, player] of shuffledPlayers.entries()) {
      teams[`${i % 2}`].push({
        player: player, 
        role: Math.floor(i / 2), 
        elo: player.elo,
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