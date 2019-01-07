
const user = require('../../userModel');
const fs = require('fs');

const errmsg = 'Sintaxis incorrecta.\nEscribe **-ayuda quest** para más información';

function valid(arg) {
  if (!arg[0] === 'set' || arg.length !== 3) {
    return false;
  }
  
  return true;
}

module.exports = (arg, msg) => {
  if (!valid(arg)) {
    msg.channel.send(errmsg);
    return;
  }
  
  let pelotaRol = msg.guild.roles.get("530454438008061962");
  if (!msg.member.roles.has(pelotaRol.id)) {
    return;
  }
  
  var fdoc = { osuUser: arg[1] };
  if (/^<@[0-9]+>$/.test(arg[1])) {
    fdoc = { discordId: arg[1].replace(/<@/, '').replace(/>/, '') };
  }

  user.findOneAndUpdate(fdoc, { $set: { quests: arg[2], } } , (err, u) => {
    if (!u) {
      msg.reply(`No existe el usuario ${arg[1]}.`);
      return;
    }
    msg.channel.send(`Se ha establecido el numero de quests a ${arg[2]}\n**Discord ID:** ${u.discordId}`);
    return;
  })
  
}
