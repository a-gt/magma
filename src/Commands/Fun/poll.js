module.exports = class extends Command {
  constructor (...options) {
    super(...options, {
      name        : 'poll',
      description : 'Create a poll',
      args        : [
        {
          key      : 'data',
          name     : 'Poll data',
          required : true,
        },
        {
          key      : 'data2',
          name     : 'Poll data',
        },
        {
          key      : 'data3',
          name     : 'Poll data',
        },
      ],
    });
  }

  run (msg, args) {
    console.log(args)
    /*if (data.match(/".+"/) !== null) {
      msg.channel.send({
        embed : {
          title : `${Utils.Emojis.graph} Creating poll ${name}`,
          color : Utils.Colors.burple,
        },
      });
    }
    else {
      msg.channel.send({
        embed : {
          title : `${Utils.Emojis.invalid} No poll name was specified.`,
          color : Utils.Colors.red,
        },
      });
    }*/
  }
};
