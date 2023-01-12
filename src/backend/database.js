const sqlite3 = require('sqlite3');

/**
 * Creates the sqlite3 database.
 * @param {String} dbPath 
 */
function createDB(dbPath) {
  let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error(`Error creating ${dbPath} with read and write permissions. Error message below.`);
      console.error(err);
      return;
    }
    console.log(`Succesfully created ${dbPath}.`);
  });

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
    discordid1 BIGINT NOT NULL,
    discordid2 BIGINT NOT NULL,
    discordid3 BIGINT NOT NULL,
    discordid4 BIGINT NOT NULL,
    discordid5 BIGINT NOT NULL,
    discordid6 BIGINT NOT NULL,
    discordid7 BIGINT NOT NULL,
    discordid8 BIGINT NOT NULL,
    discordid9 BIGINT NOT NULL,
    discordid10 BIGINT NOT NULL
  );
  `, (err) => {if (err) console.error(err);}
  );

  db.close();
}

const accessDB = (dbPath) => {
  return new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(`Error opening ${dbPath} with read and write permissions. Error message below.`);
      console.error(err);
      return;
    }
  });
}

const registerPlayer = (dbPath, discordid) => {
  let db = accessDB(dbPath);
  db.exec(
    `INSERT INTO players VALUES ('${discordid}', 1000, 0, 0, 0, 0)`,
    (err) => {if (err) console.error(err);}
  );
  db.close();
}

const modifyPlayer = (dbPath, discordid, attribute, value) => {
  let db = accessDB(dbPath);
  db.exec(
    `UPDATE players SET ${attribute} = ${value} WHERE discordid = '${discordid}'`,
    (err) => {if (err) console.error(err);}
  );
  db.close();
}

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

function getAllPlayer(dbPath, discordid) {
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

module.exports = {
  createDB: (dbPath) => createDB(dbPath),
  accessDB: (dbPath) => accessDB(dbPath),
  registerPlayer: (dbPath, discordid) => registerPlayer(dbPath, discordid),
  modifyPlayer: (dbPath, discordid, attribute, value) => modifyPlayer(dbPath, discordid, attribute, value),
  getPlayer: (dbPath, discordid, attribute) => getPlayer(dbPath, discordid, attribute),
  getAllPlayer: (dbPath, discordid) => getAllPlayer(dbPath, discordid),
};

