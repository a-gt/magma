module.exports = () => {
  const fs = require('fs');
  const path = require('path');
  const chalk = require('chalk');
  const moment = require('moment');
  const util = require('util');

  if (!fs.existsSync(path.resolve('logs'))) fs.mkdirSync(path.resolve('logs'));

  const date = moment().format('YYYY-MM-DD');
  const time = moment().format('HH:mm:ss');

  if (!fs.existsSync(path.resolve('logs', date))) fs.mkdirSync(path.resolve('logs', date));

  console.originals = {
    log   : console.log,
    error : console.error,
    warn  : console.warn,
    debug : console.debug,
  };

  // Boot Log
  console.bootLog = function (...logs) {
    logs.forEach(log => {
      console.originals.log(
        `[${chalk.blueBright('BOOT')}] ${chalk.white(
          `${
            typeof log === 'string' ? log :
            util.inspect(log, false, 4, true)}`,
        )}`,
      );
    });
  };

  // Boot Error
  console.bootError = function (...logs) {
    logs.forEach(log => {
      console.originals.error(
        `[${chalk.redBright('BOOT')}] ${chalk.gray(time)} ${chalk.white(
          `${
            typeof log === 'string' ? log :
            util.inspect(log, false, 4, true)}`,
        )}`,
      );
    });
  };

  // Info
  const infoPath = path.resolve('logs', date) + `/info.log`;
  fs.closeSync(fs.openSync(infoPath, 'a'));
  const infoFile = fs.createWriteStream(infoPath, { flags: 'a' });
  console.log = function (...logs) {
    logs.forEach(log => {
      console.originals.log(
        `[${chalk.blueBright('INFO')}] ${chalk.white(
          `${
            typeof log === 'string' ? log :
            util.inspect(log, false, 4, true)}`,
        )}`,
      );
      infoFile.write(
        `[${time}] ${
          typeof log === 'string' ? log :
          util.inspect(log, false, 4, false)}\n`,
      );
    });
  };

  // Warn
  const warnPath = path.resolve('logs', date) + `/warn.log`;
  fs.closeSync(fs.openSync(warnPath, 'a'));
  const warnFile = fs.createWriteStream(warnPath, { flags: 'a' });

  console.warn = function (...logs) {
    logs.forEach(log => {
      console.originals.warn(
        `[${chalk.yellowBright('WARN')}] ${chalk.gray(time)} ${chalk.white(
          `${
            typeof log === 'string' ? log :
            util.inspect(log, false, 4, true)}`,
        )}`,
      );
      warnFile.write(
        `[${time}] ${
          typeof log === 'string' ? log :
          util.inspect(log, false, 4, false)}}\n`,
      );
    });
  };

  // Error
  const errorPath = path.resolve('logs', date) + `/error.log`;
  fs.closeSync(fs.openSync(errorPath, 'a'));
  const errorFile = fs.createWriteStream(errorPath, { flags: 'a' });

  console.error = function (...logs) {
    logs.forEach(log => {
      console.originals.error(
        `[${chalk.redBright('ERROR')}] ${chalk.gray(time)} ${chalk.white(
          `${
            typeof log === 'string' ? log :
            util.inspect(log, false, 4, true)}`,
        )}`,
      );
      errorFile.write(
        `[${time}] ${
          typeof log === 'string' ? log :
          util.inspect(log, false, 4, false)}\n`,
      );
    });
  };

  // Debug
  console.debug = function (...logs) {
    logs.forEach(log => {
      console.originals.debug(
        `[${chalk.gray('DEBUG')}] ${chalk.white(
          `${
            typeof log === 'string' ? log :
            util.inspect(log, false, 4, true)}`,
        )}`,
      );
    });
  };
};
