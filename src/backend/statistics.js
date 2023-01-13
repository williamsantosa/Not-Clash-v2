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
 * Returns teams with players
 * @param {Array} players List containing players
 * @param {Number} n Number of teams 
 * @returns {Object} {team# : [player]}
 */
const teamSort = (players, n) => {
  const teams = {};
  for (const i = 0; i < n; i++) {
    teams[`${i}`] = [];
  }
  for (const [i, player] of players.entries()) {
    teams[`${i % n}`].push(player);
  }
  return teams;
};

module.exports = {
  
};