const fs = require('fs');

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
    this.conf = {
      name,
      description,
      category,
      enabled,
      guildOnly,
      dmOnly,
      aliases,
      permission,
      args,
      cooldown,
      hasSubs,
      dir
    };
    this.subs = [];
  }

  run(msg) {
    msg.send('hello')
  }

  /*setup() {
    if (this.hasSubs) {
      if(!this.conf.dir) throw new Error(`No Subcommands directory found.`);
      fs.readdirSync(this.conf.dir + '/' + this.conf.name)
    }
  }*/
};
