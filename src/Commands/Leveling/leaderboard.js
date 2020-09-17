module.exports = class extends Command {
  constructor (...options) {
    super(...options, {
      name      : 'leaderboard',
      aliases   : [
        'lb',
      ],
      guildOnly : true,
    });
  }

  async run (msg) {
    const manager = new this.client.database.managers.GuildDB(msg.guild.id.toString());
    const users = await manager.fetchLevelingData();
    const data = users
      .map((user, index) => {
        const lvl = Math.floor(0.1 * Math.sqrt(user.leveling.xp));
        return `${index + 1}. ${this.client.users.cache.get(
          user._id,
        )} - **${user.leveling.xp.abbreviate()} XP** - **LEVEL ${lvl}**`;
      })
      .chunk(10);
    const pages = [];
    data.forEach(a => pages.push(a.join('\n')));
    new Utils.PageMenu(msg.channel, msg.author.id, 30000, Utils.emojis.arrows, {
      data  : pages,
      embed : {
        title     : `Leaderboard of ${msg.guild.name}`,
        color     : Utils.colors.embed,
        thumbnail : {
          url : 'https://i.imgur.com/qnx3gZG.png',
        },
      },
    });
  }
};
