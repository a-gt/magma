const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const chalk = require('chalk');
const { Collection } = require('discord.js');

module.exports = class Command {
  constructor (
    client,
    {
      name = 'command',
      description = 'No description provided.',
      category = 'General',
      enabled = true,
      guildOnly = false,
      aliases = new Array(),
      permission = {
        bot  : new Array(),
        user : new Array(),
      },
      args = new Array(),
      cooldown = 6,
      hasSubs = false,
    },
  ) {
    this.client = client;
    const config = {
      name,
      description,
      category,
      enabled,
      guildOnly,
      aliases,
      permission,
      args,
      cooldown,
      hasSubs,
    };
    for (const key in config) {
      this[key] = config[key];
    }
    this.args.forEach((arg, i) => {
      if (arg.name === undefined) this.args[i].name = arg.key;
    });
    const usage = [];
    this.args.forEach(arg => {
      if (arg.required) usage.push(`<${_.startCase(arg.name)}>`);
      else usage.push(`(${_.startCase(arg.name)})`);
    });
    this.usageWithoutCmd = usage.join(' ');
    this.usage =
      `${this.name}${
        this.aliases[0] === undefined ? '' :
        `/${this.aliases.join('/')}`} ` + usage.join(' ');
    this.commands = new Collection();
    this._aliases = new Collection();
  }

  run (msg) {
    msg.send('hello');
  }

  getSub (name) {
    return this.commands.get(this._aliases.get(name));
  }

  setup () {
    if (this.hasSubs && !this.isSub) {
      if (!this._dir) throw new Error(`No Subcommands directory found.`);
      const files = fs.readdirSync(this._dir).filter(file => file !== 'index.js');
      if (files.length === 0) return console.warn(`${chalk.cyanBright(this.name.toProperCase())} does not have any subcommands.`);
      files.map(async cmdFile => {
        const _dir = path.resolve(`${this._dir}`, `${cmdFile}`);
        const ImportedCmd = require(_dir);
        if (!ImportedCmd.prototype) {
          console.warn(`${chalk.cyanBright(_dir)} does not export anything.`);
        }
        else {
          const cmd = new ImportedCmd(this.client);
          if (cmd.enabled) {
            cmd.isSub = true;
            this.commands.set(cmd.name.toLowerCase(), cmd);
            this._aliases.set(cmd.name.toLowerCase(), cmd.name.toLowerCase());
            cmd.aliases.forEach(alias => this.aliases.set(alias.toLowerCase(), cmd.name.toLowerCase()));
          }
          else {
            return;
          }
        }
      });
    }
  }
};
