const { normalize } = require('node:path');

const color = {
  blue: 0x0099FF,
  red: 0xFF0000,
  green: 0x49FF49,
  orange: 0xE67E22,
};

const roles = ['top','jungle','mid','bottom','support', 'fill', null];

const dbPath = normalize('./src/data.db');

module.exports = {
  color: color,
  roles: roles,
  dbPath: dbPath
};