module.exports = class extends Command {
  constructor (...options) {
    super(...options, {
      name : 'error',
    });
  }

  run () {
    throw new Error();
  }
};
