const _ = require('lodash');

module.exports = class extends Command {
  constructor (...options) {
    super(...options, {
      name        : 'help',
      description : 'Do this command when you need help.',
      aliases     : [
        'commands',
      ],
      args        : [
        {
          key : 'command',
        },
      ],
    });
  }

  run (msg, args) {
    const prefix = '?';
    const { commands, categories } = this.client;
    const categoryArray = categories.array().sort((a, b) => a.index - b.index);
    // Set up paginated embed
    const categoryNames =
      '**Page 1:** *Magma Help*\n' +
      categoryArray
        .map(
          (category, index) =>
            `**Page ${index + 2}:** ${category.emoji} *${category.fancy_name}* **-** ${category.description}`,
        )
        .join('\n');
    let data = [
      {
        author      : {
          name     : `Magma Help`,
          icon_url :
            'https://cdn.discordapp.com/avatars/735320616453800017/2e9f19b18cf555db194df3c168047e0c.png?size=512',
        },
        color       : Utils.Colors.embed,
        thumbnail   : {
          url : 'https://cdn.discordapp.com/avatars/735320616453800017/2e9f19b18cf555db194df3c168047e0c.png?size=512',
        },
        description : `***Magma*** is a fun and unique general purpose bot that has loads of features including, but not limited to, per guild prefix, a full-featured leveling system, and a host of fun commands.\n\n${categoryNames}`,
      },
    ];
    categoryArray.map(category => {
      const fields = [];

      category.commands.map((_command, i) => {
        const command = commands.get(_command);
        if (command.hidden) return;
        fields.push({
          name  : `${i + 1}. ${prefix}${command.usage}`,
          value : `\`\`\`${command.description}\`\`\``,
        });
      });
      if (fields.length === 0) {
        fields.push({
          name  : `No commands found for this category.`,
          value : String.fromCharCode(8203),
        });
      }
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
      // Send all commands
      new Utils.PageMenu(msg.channel, msg.author.id, 30000, Utils.Emojis.arrows, {
        data  : data,
        trash : true,
        jump  : true,
        embed : {
          footer : {
            text : 'Use the emojis to change pages.',
          },
        },
      });
      return;
    }
    const name = args.command.toLowerCase();
    const command = this.client.getCommand(name);

    // Check if its a command
    if (!command) {
      // Check if its a category
      const category = categories.get(name);
      if (!category) return msg.channel.send(`${Utils.Emojis.unavailable} **That's not a valid command or category.**`);
      let num = 0;
      categoryArray.forEach((_category, i) => {
        if (_category.name === category.name) num = i + 2;
      });
      new Utils.PageMenu(msg.channel, msg.author.id, 30000, Utils.Emojis.arrows, {
        data  : data,
        trash : true,
        jump  : true,
        start : num,
        embed : {
          footer : {
            text : 'Use the emojis to change pages.',
          },
        },
      });
      return;
    }
    // Send command data

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
    if (command.commands.size > 0) {
      data.fields.push({
        name  : 'Sub Commands',
        value : `**\`\`\`${command.subCommands
          .map((cmd, i) => {
            return `${i + 1}. ${prefix}${cmd.usage}\n  ⤷ ${cmd.description}`;
          })
          .join('\n\n')}\`\`\`**`,
      });
    }
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
            .catch(() => {
              return;
            });
        }, 70000);
      });
  }
};
