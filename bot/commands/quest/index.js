const fs = require("fs");

const config = JSON.parse(fs.readFileSync(__basedir + "/bot_config.json"));
const helpers = require(__basedir + "/commands/helpers");

const errmsg = helpers.error(
  "Sintaxis incorrecta",
  `Uso: **${
    config.prefix
  }quest** <**give** | **take**> <**@mención** | **id**> <**cantidad**>`
);

module.exports = (arg, msg) => {
  const subCommand = arg[0];
  const newArgs = arg.slice(1);
  const subCommandPath = `${__dirname}/${subCommand}`;

  // if a folder with the command name exists, run it
  fs.access(subCommandPath, fs.F_OK, err => {
    if (!err) {
      const cmdjs = require(subCommandPath);
      cmdjs(newArgs, msg);
    } else {
      msg.channel.send(errmsg);
    }
  });
};
