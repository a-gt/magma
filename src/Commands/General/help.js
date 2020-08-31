const _ = require('lodash');

module.exports = class extends Command {
  constructor (client) {
    super(client, {
      name    : 'help',
      aliases : [
        'commands',
      ],
      args    : [
        {
          key : 'command',
        },
      ],
    });
  }

  run (msg, args) {
    const prefix = '?';
    const { commands, categories } = this.client;
    const categoryArray = categories.array();
    const categoryNames =
      '**Page 1:** *Magma Help*\n' +
      categoryArray.map((category, index) => `**Page ${index + 2}:** *${category.fancy_name}*`).join('\n');
    let data = [
      {
        author      : {
          name     : `Magma Help`,
          icon_url : this.client.user.displayAvatarURL({ format: 'png', dynamic: true }),
        },
        color       : '#2F3136',
        thumbnail   : {
          url : 'https://i.imgur.com/Nustsvf.png',
        },
        description : `Help Page\n\n${categoryNames}\n\n:arrow_left:**:** Page Backward.\n :arrow_right:**:** Page Forward.\n :arrow_upper_right:**:** Go to any page.\n :wastebasket:**:** Close help menu.`,
      },
    ];
    categoryArray.map(category => {
      const fields = [];
      category.commands.map((_command, i) => {
        const command = commands.get(_command);
        fields.push({
          name  : `${i + 1}. ${prefix}${command.usage}`,
          value : `\`\`\`${command.description}\`\`\``,
        });
      });
      data.push({
        author      : {
          name     : category.fancy_name,
          icon_url : category.thumbnail,
        },
        color       : category.color,
        thumbnail   : {
          url : category.thumbnail,
        },
        description : category.description,
        fields,
      });
    });
    if (!args.command) {
      new Utils.PageMenu(msg.channel, msg.author.id, 30000, Utils.Emojis.arrows, {
        data  : data,
        trash : true,
        jump  : true,
      });
      return;
    }
    const name = args.command.toLowerCase();
    const command = this.client.getCommand(name);

    if (!command) {
      const category = categories.get(name);
      if (!category) return msg.channel.send(`${Utils.Emojis.unavailable} **That's not a valid command or category.**`);
      let num = 0;
      categoryArray.forEach((_category, i) => {
        if (_category.name === category.name) num = i + 2;
      });
      new Utils.PageMenu(msg.channel, msg.author.id, Utils.Emojis.arrows, 30000, {
        data  : data,
        trash : true,
        jump  : true,
        start : num,
      });
      return;
    }

    const { category } = command;
    const _category = categories.get(category);

    data = {};

    data.title = `**${_.capitalize(command.name)} Command**  ➤  ${_category.fancy_name}`;
    data.fields = [
      {
        name  : 'Command',
        value : `\`\`\`${prefix}${command.usage}\`\`\``,
      },
    ];
    data.thumbnail = {
      url : _category.thumnail,
    };
    data.color = _category.color;

    data.fields.push({
      name   : 'Aliases',
      value  : `\`\`\`${
        command.aliases.length === 0 ? 'None.' :
        command.aliases.join(', ')}\`\`\``,
      inline : true,
    });
    data.fields.push({
      name   : 'Cooldown',
      value  : `\`\`\`${command.cooldown} second(s)\`\`\``,
      inline : true,
    });
    if (command.description)
      data.fields.push({
        name  : 'Description',
        value : `\`\`\`${command.description}\`\`\``,
      });
    /*if (command.subCommands) {
      data.fields.push({
        name  : 'Sub Commands',
        value : `**\`\`\`${command.subCommands
          .map((cmd, i) => {
            return `${i + 1}. ${prefix}${cmd.usage}\n  ⤷ ${cmd.description}`;
          })
          .join('\n\n')}\`\`\`**`,
      });
    }*/
    if (command.usage)
      data.fields.push({
        name  : 'Usage',
        value : `\`\`\`${command.usageWithoutCmd || 'None.'}\`\`\``,
      });

    msg.channel
      .send({
        embed : data,
      })
      .then(sent => {
        setTimeout(() => {
          sent
            .delete({
              timeout : 0,
              reason  : 'Free up clutter',
            })
            .categoryArraych(() => {
              return;
            });
        }, 70000);
      });
  }
};
