module.exports = class extends Command {
  constructor (...options) {
    super(...options, {
      name    : 'error',
      hidden: true
    });
  }

  run () {
    throw new Error()
  }
};
