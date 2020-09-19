module.exports = class extends Command {
  constructor (...options) {
    super(...options, {
      name        : 'set',
      description : "Set people's XP.",
      args        : [
        {
          key      : 'user',
          name     : 'User',
          type     : 'user',
          required : true,
        },
        {
          key      : 'xp',
          name     : 'XP',
          type     : 'number',
          required : true,
        },
      ],
      permissions : {
        user : 'mod',
      },
      guildOnly   : true,
    });
  }

  async run (msg, { user, xp }) {
    if (user.bot) {
      return msg.channel.send(
        `${Utils.emojis
          .error} ${user} is a **bot!** They don't get to be in the topnotch **XP Club**. Therefore, you can't set their **XP**.`,
      );
    }
    const manager = new this.client.database.managers.UserDB(user.id.toString());
    await manager.setXP(msg.guild.id, xp);
    msg.channel.send({
      embed : {
        title       : '**XP** Change',
        color       : Utils.colors.burple,
        description : `Set <@${user.id}>'s **XP** to **${xp.abbreviate()}**`,
        author      : {
          icon_url : msg.author.displayAvatarURL({
            format  : 'png',
            dynamic : true,
          }),
          name     : msg.author.tag,
        },
      },
    });
  }
};
