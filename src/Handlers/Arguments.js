const type = async (type, arg, str, msg) => {
  let value = str;
  switch (type) {
    case 'custom':
      value = await arg.customType.run(str, msg);
      break;
    case 'user':
      if (str === undefined) value = false;
      else value = msg.client.getUserMention(str);
      break;
    case 'channel':
      if (str === undefined) value = false;
      else value = msg.client.getChannelMention(str, msg);
      break;
    case 'role':
      if (str === undefined) value = false;
      else value = msg.client.getRoleMention(str, msg);
      break;
    case 'number':
      if (str === undefined) value = false;
      else {
        const num = parseInt(str, 10);
        if (isNaN(num)) value = false;
        else value = num;
      }
      break;
  }
  return value;
};

module.exports.type = type;

const typeFancyName = (type, arg) => {
  let name = type;
  switch (type) {
    case 'custom':
      name = arg.customType.name;
      break;
    case 'user':
      name = 'User: ID / Mention';
      break;
    case 'channel':
      name = 'Channel: ID / Mention';
      break;
    case 'role':
      name = 'Role: ID / Mention';
      break;
    case 'number':
      name = 'Number';
      break;
  }
  return name;
};

module.exports.typeFancyName = typeFancyName;

const isType = async (arg, equivalent, msg) => {
  if (Array.isArray(arg.type)) {
    const typeValues = [];
    await Promise.all(
      arg.type.map(async argType => {
        typeValues.push(await type(argType, arg, equivalent, msg));
      }),
    );
    if (typeValues.includes(undefined)) return undefined;
    else if (typeValues.includes(false)) return false;
    else return typeValues.find(type => type !== undefined || type !== false);
  }
  else return type(arg.type, arg, equivalent, msg);
};

module.exports.isType = isType;
