const templateRegex = /\{(.+?)\}/g;

module.exports = (str, mainObject) => {
  const paths = str.match(templateRegex);
  let returnstr = str;

  paths.forEach(str => {
    let object = mainObject;
    const path = str.replace(/\{|\}/g, '');
    const stack = path.split('.');

    if (stack.length === 1) {
      if (typeof object[stack] === 'object') {
        object = object[stack].default;
      }
      else object = object[stack];
    }
    else {
      while (stack.length >= 1) {
        object = object[stack.shift()];
      }
    }

    return (returnstr = returnstr.replace(str, object));
  });

  return returnstr;
  /*const stack = path.split('.');

  if (stack.length === 1 || stack.length === 0) {
    return object.default;
  }

  while (stack.length > 1) {
    object = object[stack.shift()];
  }*/
};
