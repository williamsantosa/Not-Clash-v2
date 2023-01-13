// Probability functions

/**
 * Returns the probability of t0 winning
 * @param {*} t0 
 * @param {*} t1 
 * @param {*} D 
 */
const probabilityWinning = (t0, t1, D) => {
  return 1.0 / (1.0 * Math.pow(10.0, (t1 - t0) / D));
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
  
};

module.exports = {
  
};