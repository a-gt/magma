module.exports = () => {
  //String
  String.prototype.shorten = max => {
    const shortened =

        this.length > max ? `${this.slice(0, max - 3)}...` :
        this;
    return shortened;
  };

  String.prototype.toCamelCase = function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  String.prototype.toProperCase = function () {
    return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
  };

  // Array
  Array.prototype.random = () => {
    return this[Math.floor(Math.random() * this.length)];
  };

  Array.prototype.toHumanReadable = (word = 'and') => {
    const array = this;
    const last = array.pop()
    return `${array.join(', ')}, ${word} ${last}`
  };
};
