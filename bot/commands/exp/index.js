
const user = require('../../userModel');
const fs = require('fs');
const niveles = JSON.parse(fs.readFileSync('commands/user/niveles.json'));

const errmsg = 'Sintaxis incorrecta.\nEscribe **-ayuda exp** para más información';

function valid(arg) {
  if (arg[0] !== 'give' && arg[0] !== 'take' && arg[0] !== 'up') {
    return false;
  }

  if (arg[0] === 'give' && arg.length !== 3) {
    return false;
  }
  
  if (arg[0] === 'take' && arg.length !== 3) {
    return false;
  }
  
  if (arg[0] === 'up' && arg.length !== 3) {
    return false;
  }
  console.log(arg.length)
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
  
  if (arg[0] === 'give') {
    const c = Number(arg[2]);
    var fdoc = { osuUser: arg[1] };
    if (/^<@[0-9]+>$/.test(arg[1])) {
      fdoc = { discordId: arg[1].replace(/<@/, '').replace(/>/, '') };
    }
    user.findOneAndUpdate(fdoc, { $inc: { exp: arg[2], } } , (err, u) => {
      if (err) {
        msg.reply(`Un error ha ocurrido.\n${err}`);
      }
      msg.channel.send(`Se ha añadido la experiencia.\n\n**Discord ID:** ${u.discordId}`);
      return;
    })
  } else if (arg[0] === 'take') {
    const c = Number(arg[2]);
    var fdoc = { osuUser: arg[1] };
    if (/^<@[0-9]+>$/.test(arg[1])) {
      fdoc = { discordId: arg[1].replace(/<@/, '').replace(/>/, '') };
    }
    user.findOne(fdoc, (err, u) => {
      if (err) {
        msg.reply('Un error ha ocurrido.');
      }
      if (!((u.exp - arg[2]) < 0)) {
        user.findOneAndUpdate(fdoc, { $inc: { exp: -arg[2], } } , (err, u) => {
          if (err) {
            msg.reply(`Un error ha ocurrido.\n${err}`);
          }
          
          msg.channel.send(`Se ha quitado la experiencia.\n\n**Discord ID:** ${u.discordId}`);
          return;
        })
      } else {
        msg.reply('La experiencia del usuario no puede ser negativa.');
      }
    });
  } else if (arg[0] === 'up') {
    
    var fdoc = { osuUser: arg[1] };
    if (/^<@[0-9]+>$/.test(arg[1])) {
      fdoc = { discordId: arg[1].replace(/<@/, '').replace(/>/, '') };
      
    }

    user.findOne(fdoc, (err, u) => {
      if (err) {
        msg.channel.send('Ha ocurrido un error');
        return;
      }
      
      var level = 0;
      for (let n in niveles) {
        let i = niveles[n];
        if (u.exp >= i) {
          level = n;
        }
      }
    
    
      const remExp = niveles[Number(level) + Number(arg[2])] - u.exp
      
      user.findOneAndUpdate(fdoc, { $inc: { exp: remExp, } }, (err, u) => {
        if (err) {
          msg.channel.send('Ha ocurrido un error');
          return;
        }
        
        msg.channel.send(`Se ha añadido la experiencia necesaria para subir de nivel.\n**Discord ID:** ${u.discordId}`);
        return;
      });
   
    });
  }
}
