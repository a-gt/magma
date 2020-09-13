const { typeFancyName, isType } = require('./Arguments');
const Sentry = require('@sentry/node');

const run = (msg, args, command) => {
  // Handle error
  try {
    return command.run(msg, args);
  } catch (error) {
    msg.channel.send({
      embed : {
        title       : `${Utils.Emojis.error} Error while running command "${command.name.toProperCase()}"`,
        description : `If this continues please contact **Magma Support**.`,
        color       : Utils.Colors.red,
      },
    });
    console.error(error);

    if (Config.env.NODE_ENV === 'production') Sentry.captureException(error);
  }
};

const parseMessage = async (msg, command, argsArray) => {
  const cmdArgs = command.args;
  const args = {};
  const invalids = [];
  let hasPerms = true;
  if (msg.guild) {
    const member = msg.guild.member(msg.author);
    const perm = msg.client.permissionLevels[command.permissions.user];
    // Check perms
    hasPerms = perm.check(member);
  }

  if (hasPerms) {
    await Promise.all(
      cmdArgs.map(async (arg, index) => {
        let equivalent = argsArray[index];
        // Set up type
        let valid = await isType(arg, equivalent, msg);
        // Last arg
        if (index === cmdArgs.length - 1) {
          valid = await isType(arg, argsArray.slice(index, args.length).join(' '), msg);
        }
        // Missing Arguments
        if (!equivalent && arg.required) {
          invalids.push(undefined);
        }
        else if (equivalent && !valid) {
          // Invalid Argument Type
          invalids.push(false);
        }
        else if (!equivalent) {
          // Default
          invalids.push(true);
          args[arg.key] = arg.default;
        }
        else {
          // Normal
          invalids.push(true);
          args[arg.key] = valid;
        }
      }),
    );
    // Incorrrect type or missing arg
    if (invalids.includes(false) || invalids.includes(undefined)) {
      const errors = await Promise.all(
        invalids.map(async (invalid, index) => {
          const arg = cmdArgs[index];
          if (invalid === false) {
            let type =
              Array.isArray(arg.type) ? arg.type.map(el => typeFancyName(el, arg)).join(', ') :
              typeFancyName(arg.type, arg);
            return `• Argument \`${arg.name}\` must be of type \`${type}\`.`;
          }
          else if (invalid === undefined) {
            return `• Argument \`${arg.name}\` was not specified.`;
          }
        }),
      );
      msg.channel.send({
        embed : {
          title       : `${Utils.Emojis.invalid} Invalid Arguments passed into "${command.name.toProperCase()}"`,
          description : `**Here are your errors:**\n${errors.join('\n')}`,
          color       : Utils.Colors.red,
        },
      });
    }
    else {
      run(msg, args, command);
    }
  }
  else {
    msg.channel.send({
      embed : {
        title       : `${Utils.Emojis
          .unavailable} You have insufficient permissions to run "${command.name.toProperCase()}"`,
        description : `You need to be a **${perm.name}**`,
        color       : Utils.Colors.red,
      },
    });
  }
};

const runCommand = (msg, command, args) => {
  if (msg.guild) {
    msg.delete({ timeout: 0, reason: '' }).catch(() => {
      return;
    });
  }
  if (command.commands.size > 0) {
    const subCommand = command.getSub(args[0]);
    if (subCommand) {
      args.shift();
      return parseMessage(msg, subCommand, args);
    }
    return parseMessage(msg, command, args);
  }
  return parseMessage(msg, command, args);
};

module.exports = runCommand;
