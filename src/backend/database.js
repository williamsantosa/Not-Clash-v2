const sqlite3 = require('sqlite3');

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
  CREATE TABLE data (
    discordid BIGINT, 
    elo INT, 
    wins INT, 
    games INT, 
    primaryrole INT, 
    secondaryrole INT
  );
  `, (err) => {
    if (err) {
      console.error(err)
    }
  }
  );
  return db;
}

function accessDB(dbPath) {
  let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(`Error opening ${dbPath} with read and write permissions. Error message below.`);
      console.error(err);
      return;
    } else {
      console.log(`Succesfully opened ${dbPath} with read and write permissions.`)
    }
  });
  return db;
}

module.exports = {
  createDB: (dbPath) => createDB(dbPath),
  accessDB: (dbPath) => accessDB(dbPath),
};

