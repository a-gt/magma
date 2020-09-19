const mongoose = require('mongoose');
const chalk = require('chalk');

const guildSchema = require('./Models/Guild');
const userSchema = require('./Models/User');

module.exports.setup = async () => {
  await mongoose.connect(Config.env.MONGO_URI, {
    useNewUrlParser    : true,
    useUnifiedTopology : true,
    useFindAndModify   : false,
  });
};

const Guild = mongoose.model('Guild', guildSchema);
const User = mongoose.model('User', userSchema);

module.exports.Guild = Guild;
module.exports.User = User;
module.exports.managers = {};
module.exports.managers.GuildDB = require('./Managers/GuildDB');
module.exports.managers.UserDB = require('./Managers/UserDB');

mongoose.connection.once('open', () => console.bootLog(chalk.blueBright('Succesfully connected to database.')));
