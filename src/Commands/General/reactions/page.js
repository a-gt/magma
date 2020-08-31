module.exports = class extends Command {
  constructor (client) {
    super(client, {
      name    : 'page',
      enabled : true,
    });
  }

  run (msg) {
    new Utils.PageMenu(
      msg.channel,
      msg.author.id,
      15000,
      Utils.Emojis.arrows,
      {
        data  : [
          {
            color : Utils.Colors.burple,
            title : 'Page 1',
          },
          {
            color : Utils.Colors.burple,
            title : 'Page 2',
          },
        ],
        trash : true,
        jump  : true,
      },
      {
        '😄' : msg => {
          msg.channel.send('Hello');
        },
      },
    );
  }
};
