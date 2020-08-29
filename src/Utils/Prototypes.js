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
  
  // Array
  Array.prototype.random = () => {
    return this[Math.floor(Math.random() * this.length)];
  };
};
