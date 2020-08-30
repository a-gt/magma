const { Collection } = require('discord.js');

const cooldowns = new Collection();

class Cooldown {
  constructor (name, person, cooldown, run, notCool) {
    this.name = name;
    this.person = person.id;
    this.cooldown = cooldown;
    this.run = run;
    this.notCool = notCool;
    this.setup(name);
  }

  async setup (name) {
    if (!cooldowns.has(name)) {
      cooldowns.set(name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(name);
    const cooldownAmount = this.cooldown * 1000;

    if (timestamps.has(this.person)) {
      const expirationTime = timestamps.get(this.person) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return this.notCool(timeLeft);
      }
    }
    else {
      timestamps.set(this.person, now);
      setTimeout(() => timestamps.delete(this.person), cooldownAmount);

      this.run();
    }
  }
}

module.exports = Cooldown;
