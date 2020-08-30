module.exports = class extends Command {
  constructor (client) {
    super(client, {
      name    : 'error',
    });
  }

  run () {
    throw new Error()
  }
};
