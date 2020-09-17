const { User, Guild } = require('../');

module.exports = class {
  constructor (guildId) {
    this.guildId = guildId;
  }

  async fetch () {
    const data = await Guild.findById(this.guildId).exec();
    if (data === null) {
      const guild = new Guild({
        _id : this.guildId,
      });
      await guild.save();
      return (await Guild.findById(this.guildId).exec()).toObject();
    }
    else {
      return data.toObject();
    }
  }

  async set (key, value) {
    const object = {};
    object[key] = value;
    return await Guild.updateOne({ _id: this.guildId }, { $set: object }, { new: true, lean: true });
  }

  async getConfig (val) {
    const getIgnoreCase = (object, key) => {
      return object[Object.keys(object).find(k => k.toLowerCase() === key.toLowerCase())];
    };
    const guildData = await this.fetch();
    return getIgnoreCase(guildData, val);
  }

  async setConfig (key, val) {
    const getKeyIgnoreCase = (object, key) => {
      return Object.keys(object).find(k => k.toLowerCase() === key.toLowerCase());
    };
    return this.set(getKeyIgnoreCase(key), val);
  }

  async fetchUsers () {
    const allUsers = await User.find({ guilds: { $elemMatch: { guild: this.guildId } } }).exec();
    const users = allUsers.map(user => {
      return {
        ...user.toObject(),
        ...user.toObject().guilds.find(data => data.guild === this.guildId),
        _id : user.toObject()._id,
      };
    });
    return users;
  }

  async fetchLevelingData () {
    const data = await this.fetchUsers();
    return data.sort((a, b) => a.leveling.xp - b.leveling.xp).reverse();
  }
};
