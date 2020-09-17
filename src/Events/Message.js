const Cooldown = require('../Utils/Classes/Cooldown');
const runCommand = require('../Handlers/CommandHandler');

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = msg => {
  const client = msg.client;
  if (msg.author.bot) return;
  let args;
  if (msg.guild) {
    const user = new client.database.managers.UserDB(msg.author.id.toString());
    new Cooldown(
      'xp-cooldown',
      msg.author,
      60,
      async () => {
        await user.incrementLeveling(msg);
      },
      () => {
        return;
      },
    );
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex('?')})\\s*`);
    if (!prefixRegex.test(msg.content)) return;

    const [
      ,
      matchedPrefix,
    ] = msg.content.match(prefixRegex);
    args = msg.content.slice(matchedPrefix.length).trim().split(/\ +/);
  }
  else {
    args = msg.content.split(/\ +/);
  }
  let commandName = args.shift().toLowerCase();
  let cmd = client.getCommand(commandName);

  if (!cmd) return;

  const quotes = args.join(' ').split(/"/g);

  const _args = [];

  quotes.forEach((text, index) => {
    if (text === '') {
      return;
    }
    else if (index % 2 !== 0) _args.push(text);
    else {
      const splitText = text.split(/\ +/);
      splitText.forEach(_text => {
        _args.push(_text);
      });
    }
  });

  if (cmd.guildOnly && !msg.guild) {
    return;
  }

  new Cooldown(
    cmd.name,
    msg.author,
    cmd.cooldown,
    () => {
      runCommand(msg, cmd, _args);
    },
    timeLeft => {
      return msg.channel.send({
        embed : {
          title       : `${Utils.emojis
            .unavailable} Please wait for the cooldown of "${cmd.name.toProperCase()}" to finish.`,
          description : `**Please wait ${timeLeft.toFixed(
            1,
          )} more second(s) before reusing the \`${cmd.name.toProperCase()}\` command.**`,
          color       : Utils.colors.red,
        },
      });
    },
  );
};
