const templateRegex = /\{(.+?)\}/g;

module.exports = (str, object) => {
  const stack = str.split('.');

  if (stack.length === 1 || stack.length === 0) {
    return object.default;
  }

  while (stack.length > 1) {
    object = object[stack.shift()];
  }

  return object[stack.shift()];
};
