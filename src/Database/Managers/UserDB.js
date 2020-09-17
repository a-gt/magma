const { User, managers } = require('../');
const { GuildDB } = managers;

module.exports = class {
  constructor (userId) {
    this.userId = userId;
  }

  async fetch () {
    const data = await User.findById(this.userId).exec();
    if (data === null) {
      const user = new User({
        _id : this.userId,
      });
      await user.save();
      return (await User.findById(this.userId).exec()).toObject();
    }
    else {
      return data.toObject();
    }
  }

  async guildData (guild) {
    let guildList = await this.fetch();
    if (guildList.guilds[0] === undefined) {
      await this.set('guilds', [
        {
          messages : 0,
          guild,
          leveling : {
            xp : 0,
          },
        },
      ]);
      guildList = await this.fetch();
    }
    else if (guildList.guilds.find(data => data.guild === guild) === undefined) {
      guildList.guilds.push({
        messages : 0,
        guild,
        leveling : {
          xp : 0,
        },
      });
      await this.set('guilds', guildList.guilds);
      guildList = await this.fetch();
    }
    return guildList.guilds.find(data => data.guild === guild);
  }

  async set (key, value) {
    const object = {};
    object[key] = value;
    return await User.updateOne({ _id: this.userId }, { $set: object }, { new: true, lean: true });
  }

  async incrementLeveling (msg) {
    const guildData = await this.guildData(msg.guild.id.toString());
    const guild = await new GuildDB(msg.guild.id.toString()).fetch();
    const userData = await this.fetch();
    let guildIndex = 0;
    userData.guilds.map((data, i) => {
      if (data.guild === guildData.guild) guildIndex = i;
    });
    const add = Math.floor(Math.random() * (25 - 15 + 1) + 15);
    guildData.messages++;
    const leveling = guildData.leveling;
    leveling.xp += add;
    const lvl = Math.floor(0.1 * Math.sqrt(leveling.xp));
    const XP = leveling.xp - 100 * lvl * lvl;
    const goal = 100 * (lvl + 1) * (lvl + 1) - 100 * lvl * lvl;
    if (lvl > leveling.lvl) {
      const previousGoal = 100 * lvl * lvl - 100 * (lvl - 1) * (curLvl - 1);
      msg.channel.send(
        Utils.Templater(guild.xpLevelUp, {
          user     : `<@${msg.author.id}>`,
          lvl      : lvl,
          goal     : goal,
          xp       : XP,
          total_xp : leving.xp,
          previous : { lvl: lvl - 1, goal: previousGoal },
        }),
      );
    }
    guildData.leveling = leveling;
    userData.guilds[guildIndex] = guildData;
    this.set('guilds', userData.guilds);
  }

  async setXP (guildId, xp) {
    const guildData = await this.guildData(guildId.toString());
    const userData = await this.fetch();
    let guildIndex = 0;
    userData.guilds.map((data, i) => {
      if (data.guild === guildData.guild) guildIndex = i;
    });
    const leveling = guildData.leveling;
    leveling.xp = xp;
    guildData.leveling = leveling;
    userData.guilds[guildIndex] = guildData;
    this.set('guilds', userData.guilds);
  }

  async fetchLevelingData (guild) {
    const manager = new GuildDB(guild);
    const leveling = await manager.fetchLevelingData();
    const index = leveling.findIndex(user => user._id === this.userId);
    const user = leveling[index];
    if (!user) {
      return undefined;
    }
    const lvl = Math.floor(0.1 * Math.sqrt(user.leveling.xp));
    const XP = user.leveling.xp - 100 * lvl * lvl;
    const goal = 100 * (lvl + 1) * (lvl + 1) - 100 * lvl * lvl;
    return { ...user, rank: index, lvl, goal, xp: XP, total_xp: user.leveling.xp };
  }
};
