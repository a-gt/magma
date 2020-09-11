module.exports = class extends Command {
  constructor (...options) {
    super(...options, {
      name        : 'error',
      hidden      : true,
      permissions : {
        user : 'dev',
      },
    });
  }

  run () {
    throw new Error();
  }
};
