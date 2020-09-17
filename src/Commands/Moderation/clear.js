module.exports = class extends Command {
  constructor (...options) {
    super(...options, {
      name        : 'clear',
      aliases     : [
        'prune',
      ],
      permissions : {
        user : 'mod',
      },
      guildOnly   : true,
      args        : [
        {
          key      : 'num',
          name     : 'Messages to delete',
          type     : 'number',
          required : true,
        },
      ],
    });
  }

  run (msg, args) {
    let amount = args.num;
    if (amount < 2) {
      return msg.channel.send(Utils.emojis.unavailable + '**You need to input a number between 2 and 100.**');
    }
    if (amount > 100) amount = 100;
    msg.channel
      .bulkDelete(amount, true)
      .then(() => {
        msg.channel
          .send({
            embed : {
              description : `I deleted ${amount} message(s).`,
              color       : '#2F3136',
            },
          })
          .then(sent => {
            sent.delete({
              timeout : 3000,
              reason  : 'Bulk Delete.',
            });
          });
      })
      .catch(err => {
        msg.channel.send(Utils.emojis.error + 'There was an error trying to clear messages in this channel!');
        throw err;
      });
  }
};
