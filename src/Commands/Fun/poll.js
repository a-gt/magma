module.exports = class extends Command {
  constructor (...options) {
    super(...options, {
      name        : 'poll',
      description : 'Create a poll',
      args        : [
        {
          key      : 'name',
          name     : 'Poll Name',
          required : true,
        },
        {
          key      : 'option-1',
          name     : 'Option 1',
          required : true,
        },
        {
          key      : 'option-2',
          name     : 'Option 2',
          required : true,
        },
        {
          key  : 'option-3',
          name : 'Option 3',
        },
        {
          key  : 'option-4',
          name : 'Option 4',
        },
        {
          key  : 'option-4',
          name : 'Option 4',
        },
        {
          key  : 'option-5',
          name : 'Option 5',
        },
        {
          key  : 'option-6',
          name : 'Option 6',
        },
        {
          key  : 'option-7',
          name : 'Option 7',
        },
        {
          key  : 'option-8',
          name : 'Option 8',
        },
        {
          key  : 'option-9',
          name : 'Option 9',
        },
        {
          key  : 'option-10',
          name : 'Option 10',
        },
      ],
    });
  }

  run (msg, args) {
    msg.channel.send({
      embed : {
        title : `${Utils.Emojis.graph} Creating poll ${args.name}`,
        color : Utils.Colors.burple,
      },
    });
  }
};
