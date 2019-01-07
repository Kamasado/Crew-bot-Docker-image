const fs = require('fs');
const path = require('path');

const errmsg = 'El comando especificado no existe.';

function valid(arg) {
  const cmdpath = path.join(__dirname, '../', `${arg.length == 1 ? arg[0] : 'ayuda'}`);
  if (!fs.existsSync(cmdpath)) {
    return false;
  } else if (!(arg.length == 1 || arg.length == 0)) {
    return false;
  }
  return cmdpath;
}

module.exports = (arg, msg) => {
  const folder = valid(arg);

  if (!folder) {
    msg.reply(errmsg);
    return;
  }

  fs.readFile(`${folder}/helpfile`, 'utf8', (err, data) => {
    const all = `${data}`.split('/-');
    const helptitle = all[0].split('-=')[0];
    const helpdesc = all[0].split('-=')[1];
    const helpsections = all.slice(1);

    let fields = [];
    for (const field of helpsections) {
      const fieldpart = field.split('-=');
      fields.push({
        name: fieldpart[0],
        value: fieldpart[1]
      });
    }
    
    const embed = {embed: {
      color: 3447003,
      title: helptitle,
      description: helpdesc,
      fields,
      footer: {
        text: `Osu!Crew || 2.0`,
        icon_url: 'https://cdn.discordapp.com/icons/524295442347851799/49ef0d0e6048cf6adb32fa2738022e54.webp'
      }
    }
  }
    msg.channel.send(embed);
  });

  
}