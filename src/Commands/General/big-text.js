module.exports = class extends Command {
  constructor (...options) {
    super(...options, {
      name    : 'big-text',
      aliases : [
        'big-text',
        'big',
      ],
      args    : [
        {
          key      : 'text',
          required : true,
        },
      ],
    });
  }

  run (msg, { text }) {
    const big = [
      ...text,
    ]
      .map(char => {
        if (!Utils.Emojis[char]) {
          return char + String.fromCharCode(8203);
        }
        else return Utils.Emojis[char] + String.fromCharCode(8203);
      })
      .join('');
    msg.channel.send(big);
  }
};
