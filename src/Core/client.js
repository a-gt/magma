const Discord = require('discord.js');

class Magma extends Discord.Client {
  constructor (...options) {
    super(...options);
    [
      'commands',
      'categories',
      'aliases',
    ].forEach(el => (this[el] = new Discord.Collection()));

    this.groups = options[0].groups;
  }

  getCommand (name) {
    return this.commands.get(this.aliases.get(name));
  }

  runCommand (name, msg, args) {}

  getUserMention (mention) {
    if (!mention) return false;
    const matches = mention.match(/^(?:<@!?)?([0-9]+)>?$/);
    if (matches) {
      const id = matches[1];
      return this.users.cache.get(id) || false;
    }
    const user = this.users.cache.get(mention);
    if (user) {
      return user;
    }
    return false;
  }

  getChannelMention (mention, msg) {
    if (!mention) return false;
    const matches = mention.match(/^(?:<#)?([0-9]+)>?$/);
    if (matches) {
      const id = matches[1];
      return msg.guild.channels.cache.get(id) || false;
    }
    const channel = msg.guild.channels.cache.get(mention);
    if (channel) {
      return channel;
    }
    return false;
  }

  getRoleMention (mention, msg) {
    if (!mention) return false;
    const matches = mention.match(/^(?:<@&)?([0-9]+)>?$/);
    if (matches) {
      const id = matches[1];
      return msg.guild.roles.cache.get(id) || false;
    }
    const role = msg.guild.roles.cache.get(mention);
    if (role) {
      return role;
    }
    return false;
  }
}

module.exports = Magma;
