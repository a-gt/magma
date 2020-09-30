module.exports = class extends Command {
  constructor (...options) {
    super(...options, {
      name : 'reaction',
    });
  }

  run (msg) {
    new Utils.ReactionMenu(
      msg.channel,
      msg.author.id,
      30000,
      {
        embed : {
          color : Utils.colors.embed,
          title : 'Main Page',
        },
      },
      {
        '😄' : {
          data   : {
            embed : {
              color : Utils.colors.embed,
              title : 'Page 😄',
            },
          },
          emojis : {
            '😢' : message => {
              message.channel.send('😢 ***Cry***');
            },
          },
        },
      },
      {},
    );
  }
};
