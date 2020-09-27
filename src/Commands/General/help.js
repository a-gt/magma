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
    const categoryArray = categories.array().sort((a, b) => a.index - b.index).filter(category => !category.hidden);
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
        color       : Utils.colors.embed,
        thumbnail   : {
          url : 'https://cdn.discordapp.com/avatars/735320616453800017/2e9f19b18cf555db194df3c168047e0c.png?size=512',
        },
        description : `***Magma*** is a fun and unique general purpose bot that has loads of features including, but not limited to, per guild prefix, a full-featured leveling system, and a host of fun commands.\n\n${categoryNames}`,
      },
    ];
    categoryArray.map(category => {
      const fields = [];

      category.commands.map(_command => {
        const command = commands.get(_command);
        if (command.hidden) return;
        let hasPerms = true;
        if (msg.guild) {
          const member = msg.guild.member(msg.author);
          const perm = msg.client.permissionLevels[category.permission];
          // Check perms
          hasPerms = perm.check(member);
        }
        fields.push({
          name  : `${fields.length + 1}. ${prefix}${command.usage}`,
          value : `\`\`\`${command.description}\`\`\`${
            !hasPerms ? `${Utils.emojis.unavailable} **You do not have enough permissions to run this.**` :
            ''}`,
        });
        if (command.hasSubs) {
          command.commands.forEach(sub => {
            if (sub.hidden) return;
            let subHasPerms = true;
            if (msg.guild) {
              const member = msg.guild.member(msg.author);
              const perm = msg.client.permissionLevels[category.permission];
              // Check perms
              subHasPerms = perm.check(member);
            }
            fields.push({
              name  : `${fields.length + 1}. ${prefix}${command.name}${
                command.aliases[0] === undefined ? '' :
                `/${command.aliases.join('/')}`} ${sub.usage}`,
              value : `\`\`\`${sub.description}\`\`\`${
                !subHasPerms ? `${Utils.emojis.unavailable} **You do not have enough permissions to run this.**` :
                ''}`,
            });
          });
        }
      });
      if (fields.length === 0) {
        fields.push({
          name  : `No commands found for this category.`,
          value : String.fromCharCode(8203),
        });
      }
      let hasPerms = true;
      if (msg.guild) {
        const member = msg.guild.member(msg.author);
        const perm = msg.client.permissionLevels[category.permission];
        // Check perms
        hasPerms = perm.check(member);
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
        description : `${category.description}\n${
          !hasPerms ? `${Utils.emojis
            .unavailable} **You do not have enough permissions to run commands any in this category.**` :
          ''}`,
        fields,
      });
    });
    if (!args.command) {
      // Send all commands
      new Utils.PageMenu(msg.channel, msg.author.id, 30000, Utils.emojis.arrows, {
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
    if (!command || command.hidden) {
      // Check if its a category
      const category = categories.get(name);
      if (!category || category.hidden)
        return msg.channel.send(`${Utils.emojis.unavailable} **That's not a valid command or category.**`);
      let num = 0;
      categoryArray.forEach((_category, i) => {
        if (_category.name === category.name) num = i + 2;
      });
      new Utils.PageMenu(msg.channel, msg.author.id, 30000, Utils.emojis.arrows, {
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

    let hasPerms = true;
    if (msg.guild) {
      const member = msg.guild.member(msg.author);
      const perm = msg.client.permissionLevels[command.permissions.user];
      // Check perms
      hasPerms = perm.check(member);
    }

    data = {};

    data.title = `**${_.capitalize(command.name)} Command**  ➤  ${_category.fancy_name}`;
    if (!hasPerms) {
      data.description = `**Note: You do not have enough permissions to run this command. You need to be a ${msg.client
        .permissionLevels[command.permissions.user].name}.**`;
    }
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
        value : `**\`\`\`${command.commands
          .map(cmd => {
            return `${prefix}${command.name} ${cmd.usage}\n    ${cmd.description}`;
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
