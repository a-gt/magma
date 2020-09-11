require('dotenv').config();
const { DISCORD_TOKEN, DEFAULT_PREFIX } = process.env;

const config = {
  bot         : {
    token : DISCORD_TOKEN,
  },

  env         : process.env,

  defaults    : {
    prefix : DEFAULT_PREFIX,
  },

  developers  : [
    '541093152497598494',
    '534861925461393409',
  ],

  permissions : [
    {
      name  : 'User',
      dev   : 'user',
      check () {
        return true;
      },
    },
    {
      name  : 'Moderator',
      dev   : 'mod',
      check : member => {
        return member.hasPermission(
          [
            'KICK_MEMBERS',
            'BAN_MEMBERS',
            'MANAGE_MESSAGES',
          ],
          { checkAdmin: true, checkOwner: true },
        );
      },
    },
    {
      name  : 'Administrator',
      dev   : 'admin',
      check : member => {
        return member.hasPermission(
          [
            'ADMINISTRATOR',
          ],
          { checkAdmin: true, checkOwner: true },
        );
      },
    },
    {
      name  : 'Server Owner',
      dev   : 'server_owner',
      check : member => {
        return member.hasPermission(
          [
            'ADMINISTRATOR',
          ],
          { checkAdmin: true, checkOwner: true },
        );
      },
    },
    {
      name  : 'Magma Developer',
      dev   : 'dev',
      check : member => {
        return this.developers.includes(member.id.toString());
      },
    },
  ],
};

module.exports = config;
