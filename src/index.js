require('./Utils/Console')();
require('dotenv').config();
const path = require('path');
global.include = function (...file) {
    return require(path.resolve(...file));
};
const chalk = require('chalk');
const Magma = require('./Core');
const fs = require('fs');
const yaml = require('yaml');
const templater = include('Utils/')

const client = new Magma.client();

const boot = async () => {
  console.bootLog(`Starting Magma on ${process.env.NODE_ENV} environment.`);
  console.bootLog(`Made by ${chalk.blueBright('ApexioDaCoder')}!`);
  console.bootLog(`Loading commands from src/Commands.`);
  const dirs = fs.readdirSync(__dirname + '/Commands');
  await Promise.all(
    dirs.map(async dir => {
      const files = fs.readdirSync(`${__dirname}/Commands/${dir}`).filter(file => file.endsWith('.js'));
      const category = yaml.parse(fs.readFileSync(`${__dirname}/Commands/${dir}/category.yml`, 'utf8'));
      const cmds = [];
      await Promise.all(files.map(async cmdFile => {}));
    }),
  );
  client.login(process.env.DISCORD_TOKEN);
};

boot();

client.on('ready', async () => {
  console.bootLog('Magma is alive!');
});

// client.on('debug', m => console.debug(m));
client.on('warn', m => console.warn(m));
client.on('error', m => console.error(m));
