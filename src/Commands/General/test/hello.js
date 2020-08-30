module.exports = class extends Command {
  constructor (client) {
    super(client, {
      name    : 'hello',
      enabled : true,
    });
  }

  run (msg) {
    msg.channel.send({
      embed : {
        color       : Colors.burple,
        title       : 'Test',
        description : 'Subcommands work!',
      },
    });
  }
};
