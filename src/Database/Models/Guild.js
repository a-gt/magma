const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const guildSchema = new Schema({
  _id           : String,
  prefix        : {
    type      : String,
    default   : '?',
    maxlength : 5,
  },
  deleteCmdMsgs : {
    type    : Boolean,
    default : true,
  },
  xpLevelUp     : {
    type    : String,
    default : 'GG {user}, You are now level **{lvl}**! You now need to get **{goal} XP** to level up.',
  },
});

module.exports = guildSchema;
