module.exports = class extends Command {
  constructor (client) {
    super(client, {
      name    : 'react',
      enabled : true,
    });
  }

  run (msg) {
    msg.channel.send({
      embed : {
        color : Utils.Colors.burple,
        title : 'Reactions',
      },
    });
  }
};
