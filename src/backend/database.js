const sqlite3 = require('sqlite3');

// Basic Database Functions

/**
 * Creates the sqlite3 database.
 * @param {String} dbPath 
 */
const createDB = (dbPath) => {
  let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error(`Error creating ${dbPath} with read and write permissions. Error message below.`);
      console.error(err);
      return;
    }
    console.log(`Succesfully created ${dbPath}.`);
  });

  // player# is stored as JSON string with properties 
  // {discordid: string, team: int, role: int, elochange: int}
  // roles: [0 - 5] = [top, jungle, mid, bottom, support, fill]
  db.exec(`
  CREATE TABLE players (
    discordid TEXT NOT NULL PRIMARY KEY, 
    elo INT NOT NULL, 
    wins INT NOT NULL, 
    games INT NOT NULL, 
    primaryrole INT, 
    secondaryrole INT
  );
  CREATE TABLE matches (
    matchid TEXT NOT NULL PRIMARY KEY,
    player0 TEXT NOT NULL,
    player1 TEXT NOT NULL,
    player2 TEXT NOT NULL,
    player3 TEXT NOT NULL,
    player4 TEXT NOT NULL,
    player5 TEXT NOT NULL,
    player6 TEXT NOT NULL,
    player7 TEXT NOT NULL,
    player8 TEXT NOT NULL,
    player9 TEXT NOT NULL
  );
  `, (err) => {if (err) console.error(err);}
  );

  db.close();
}

/**
 * Accesses the database
 * @param {String} dbPath 
 * @returns 
 */
const accessDB = (dbPath) => {
  return new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(`Error opening ${dbPath} with read and write permissions. Error message below.`);
      console.error(err);
      return;
    }
  });
}

// Player Functions

/**
 * Registers player to the database
 * @param {String} dbPath 
 * @param {String} discordid 
 */
const registerPlayer = (dbPath, discordid) => {
  let db = accessDB(dbPath);
  db.exec(
    `INSERT INTO players VALUES ('${discordid}', 1000, 0, 0, 5, 5)`,
    (err) => {if (err) console.error(err);}
  );
  db.close();
}

/**
 * Modifies player entry
 * @param {String} dbPath 
 * @param {String} discordid 
 * @param {String} attribute 
 * @param {Number} value 
 */
const modifyPlayer = (dbPath, discordid, attribute, value) => {
  let db = accessDB(dbPath);
  db.exec(
    `UPDATE players SET ${attribute} = ${value} WHERE discordid = '${discordid}'`,
    (err) => {if (err) console.error(err);}
  );
  db.close();
}

/**
 * Gets player entry for attribute
 * @param {String} dbPath 
 * @param {String} discordid 
 * @param {String} attribute 
 * @return {value}
 */
const getPlayer = (dbPath, discordid, attribute) => {
  const db = accessDB(dbPath);
  return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.get(`SELECT ${attribute} FROM players WHERE discordid = '${discordid}'`, [], (err, rows) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	});
}

/**
 * Gets player entry
 * @param {String} dbPath 
 * @param {String} discordid 
 * @returns {value}
 */
const getAllPlayer = (dbPath, discordid) => {
  let db = accessDB(dbPath);
  return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.get(`SELECT * FROM players WHERE discordid = '${discordid}'`, [], (err, rows) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	});
}

/**
 * Gets column from players
 * @param {String} dbPath 
 * @param {String} discordid 
 * @returns {value}
 */
const getColumnPlayers = (dbPath, column) => {
  let db = accessDB(dbPath);
  return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.all(`SELECT ${column} FROM players`, [], (err, rows) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	});
}

/**
 * Gets all from players
 * @param {String} dbPath 
 * @param {String} attribute
 * @returns {value}
 */
const getAllPlayers = (dbPath, attribute='') => {
  let db = accessDB(dbPath);
  return new Promise((resolve, reject) => {
		db.serialize(() => {
      const sql = (attribute) ? `SELECT * FROM players ORDER BY ${attribute} DESC` : `SELECT * FROM players`;
			db.all(sql, [], (err, rows) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	});
}

// Matches Function

/**
 * Registers match to the database
 * @param {String} dbPath 
 * @param {String} matchid 
 * @param {Array[String]} players 
 */
const registerMatch = (dbPath, matchid, players) => {
  let db = accessDB(dbPath);
  let sql = `INSERT INTO matches VALUES ('${matchid}'`;
  players.forEach(player => {
    const e = (typeof player === 'object') ? JSON.stringify(player) : player;
    sql += `, '${e}'`;
  });
  sql += ')';
  db.exec(sql, (err) => {if (err) console.error(err);});
  db.close();
}

/**
 * Modifies match entry
 * @param {String} dbPath 
 * @param {String} matchid
 * @param {String} attribute 
 * @param {String} value 
 */
const modifyMatch = (dbPath, matchid, attribute, value) => {
  let db = accessDB(dbPath);
  const e = (typeof value === 'object') ? JSON.stringify(value) : value;
  db.exec(
    `UPDATE matches SET ${attribute} = '${e}' WHERE matchid = '${matchid}'`,
    (err) => {if (err) console.error(err);}
  );
  db.close();
}

/**
 * Gets match entry for attribute
 * @param {String} dbPath 
 * @param {String} matchid 
 * @param {String} attribute 
 * @return {value}
 */
const getMatch = (dbPath, matchid, attribute) => {
  const db = accessDB(dbPath);
  return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.get(`SELECT ${attribute} FROM matches WHERE matchid = '${matchid}'`, [], (err, rows) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	});
}

/**
 * Gets match entry
 * @param {String} dbPath 
 * @param {String} matchid 
 * @returns {value}
 */
const getAllMatch = (dbPath, matchid) => {
  let db = accessDB(dbPath);
  return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.get(`SELECT * FROM matches WHERE matchid = '${matchid}'`, [], (err, rows) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	});
}

/**
 * Gets column from matches
 * @param {String} dbPath 
 * @param {String} discordid 
 * @returns {value}
 */
const getColumnMatches = (dbPath, column) => {
  let db = accessDB(dbPath);
  return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.all(`SELECT ${column} FROM matches`, [], (err, rows) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	});
}

/**
 * Gets all from matches
 * @param {String} dbPath 
 * @param {String} attribute
 * @returns {value}
 */
const getAllMatches = (dbPath, attribute='') => {
  let db = accessDB(dbPath);
  return new Promise((resolve, reject) => {
		db.serialize(() => {
      const sql = (attribute) ? `SELECT * FROM matches ORDER BY ${attribute} DESC` : `SELECT * FROM matches`;
			db.all(sql, [], (err, rows) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	});
}

module.exports = {
  createDB: (dbPath) => createDB(dbPath),
  accessDB: (dbPath) => accessDB(dbPath),
  registerPlayer: (dbPath, discordid) => registerPlayer(dbPath, discordid),
  modifyPlayer: (dbPath, discordid, attribute, value) => modifyPlayer(dbPath, discordid, attribute, value),
  getPlayer: (dbPath, discordid, attribute) => getPlayer(dbPath, discordid, attribute),
  getAllPlayer: (dbPath, discordid) => getAllPlayer(dbPath, discordid),
  getColumnPlayers: (dbPath, column) => getColumnPlayers(dbPath, column),
  getAllPlayers: (dbPath, attribute) => getAllPlayers(dbPath, attribute),
  registerMatch: (dbPath, matchid, players) => registerMatch(dbPath, matchid, players),
  modifyMatch: (dbPath, matchid, attribute, value) => modifyMatch(dbPath, matchid, attribute, value),
  getMatch: (dbPath, matchid, attribute) => getMatch(dbPath, matchid, attribute),
  getAllMatch: (dbPath, matchid) => getAllMatch(dbPath, matchid),
  getColumnMatches: (dbPath, column) => getColumnMatches(dbPath, column),
  getAllMatches: (dbPath, attribute) => getAllMatches(dbPath, attribute)
};

