const { typeFancyName, isType } = require('./Arguments');

const run = (msg, args, command) => {
  try {
    return command.run(msg, args);
  } catch (error) {
    msg.channel.send({
      embed : {
        title       : `${Emojis.error} Error while running command "${command.name.toProperCase()}"`,
        description : `If this continues please contact **Magma Support**.`,
        color       : Colors.red,
      },
    });
    console.error(error);
  }
};

const parseMessage = async (msg, command, argsArray) => {
  const cmdArgs = command.args;
  const args = {};
  const invalids = [];
  await Promise.all(
    cmdArgs.map(async (arg, index) => {
      const equivalent = argsArray[index];
      // Set up type
      let valid = await isType(arg, equivalent, msg);
      // Last arg
      if (index === argsArray.length - 1) {
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
  if (invalids.includes(false) || invalids.includes(undefined)) {
    const errors = await Promise.all(
      invalids.map(async (invalid, index) => {
        const arg = cmdArgs[index];
        if (invalid === false) {
          let type =
            Array.isArray(arg.type) ? arg.type.map(el => typeFancyName(el, arg)).join(', ') :
            typeFancyName(arg.type, arg);
          return `● Argument \`${arg.name}\` must be of type \`${type}\`.`;
        }
        else if (invalid === undefined) {
          return `● Argument \`${arg.name}\` was not specified.`;
        }
      }),
    );
    msg.channel.send({
      embed : {
        title       : `${Emojis.invalid} Invalid Arguments passed into "${command.name.toProperCase()}"`,
        description : `**Here are your errors:**\n${errors.join('\n')}`,
        color       : Colors.red,
      },
    });
  }
  else {
    run(msg, args, command);
  }
};

const runCommand = (msg, command, args) => {
  if (command.commands.size > 0) {
    const subCommand = command.getSub(args[0]);
    if (subCommand) {
      return parseMessage(msg, subCommand, args.shift);
    }
    return parseMessage(msg, command, args);
  }
  return parseMessage(msg, command, args);
};

module.exports = runCommand;
