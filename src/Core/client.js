const Discord = require('discord.js');

class Magma extends Discord.Client {
  constructor (...options) {
    super(...options);
    [
      'commands',
      'categories',
      'aliases',
    ].forEach(el => (this[el] = new Discord.Collection()));
  }

  runCommand (name, msg, args) {}

  async getMention (mention) {
    if (!mention) return false;
    const matches = mention.match(/^(?:<@!?)?([0-9]+)>?$/);
    if (matches) {
      const id = matches[1];
      return this.users.cache.get(id) || false;
    }
    const user = this.users.cache.get(mention);
    if (!!user) {
      return user;
    }
    return false;
  }

  shorten (str, max) {
    const shortened =

        str.length > max ? `${str.slice(0, max - 3)}...` :
        str;
    return shortened;
  }
}

module.exports = Magma;
