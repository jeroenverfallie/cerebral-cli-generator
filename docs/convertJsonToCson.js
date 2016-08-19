var season = require('season');

const file = season.readFileSync('./defaultConfig.json');
season.writeFileSync('./defaultConfig.cson', file);
