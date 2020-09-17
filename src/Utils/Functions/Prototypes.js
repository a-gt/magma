const numeral = require('numeral');

module.exports = () => {
  //String
  String.prototype.shorten = function (max) {
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
  Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
  };

  Array.prototype.toHumanReadable = function (word = 'and') {
    const array = this;
    const last = array.pop();
    return `${array.join(', ')}, ${word} ${last}`;
  };

  Array.prototype.chunk = function (chunkSize = 25) {
    chunks = [];
    for (var i = 0; i < this.length; i += chunkSize) chunks.push(this.slice(i, i + chunkSize));
    return chunks;
  };

  // Number
  Number.prototype.abbreviate = function () {
    if (this < 1000) {
      return this;
    }
    else {
      if (this % 1000 === 0) {
        return numeral(this).format('0a').toUpperCase();
      }
      else {
        return numeral(this).format('0.00a').toUpperCase();
      }
    }
  };
};
