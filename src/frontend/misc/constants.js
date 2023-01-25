const { normalize } = require('node:path');

module.exports = {
  color: {
    blue: 0x0099FF,
    red: 0xFF0000,
    green: 0x49FF49,
    orange: 0xE67E22,
  },
  roles: ['top','jungle','mid','bottom','support', 'fill', null],
  dbPath: normalize('./src/data.db')
};