const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id        : String,
  color      : { type: String, default: 'none' },
  background : { type: String, default: 'https://i.imgur.com/CBKLW1O.jpg' },
  guilds     : [
    {
      messages : {
        type    : Number,
        default : 0,
      },
      guild    : String,
      leveling : {
        xp : {
          type    : Number,
          default : 0,
        },
      },
    },
  ],
});

module.exports = userSchema;
