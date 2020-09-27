module.exports = class extends Command {
  constructor (...options) {
    super(...options, {
      name    : 'args',
      aliases : [
        'arg',
      ],
      args    : [
        {
          key      : 'args',
          required : true,
        },
      ],
    });
  }

  run (msg, args) {
    if (args.args.toLowerCase() === 'foo') {
      return msg.channel.send('**Bar!!!**');
    }

    msg.channel.send({
      embed : {
        color       : Utils.colors.embed,
        title       : 'Args Info',
        description : `**\`\`\`Arguments: ${args.args}\nArguments length: ${args.args.length}\`\`\`**`,
      },
    });
  }
};
