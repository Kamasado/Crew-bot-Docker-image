const fs = require('fs');
const user = require('../../userModel');
const Discord = require('discord.js');
const niveles = JSON.parse(fs.readFileSync('commands/user/niveles.json'));
const names = JSON.parse(fs.readFileSync('commands/user/names.json'));
const badges = JSON.parse(fs.readFileSync('commands/badges.json'));

const errmsg = 'Sintaxis incorrecta.\nEscribe **-ayuda user** para más información';

function valid(arg) {
  if (!arg[0] === 'create' || !arg[0] === 'delete' || !arg[0] === 'list' || !arg[0] === 'find') {
    return false;
  }

  if (arg[0] === 'create' && !arg.length === 3) {
    return false;
  }
  
  if (arg[0] === 'delete' && !arg.length === 2) {
    return false;
  }
  
  if (arg[0] === 'find' && !arg.length === 2) {
    return false;
  }
  return true;
}

module.exports = (arg, msg) => {
  if (!valid(arg)) {
    msg.reply(errmsg);
    return;
  }
  
  let pelotaRol = msg.guild.roles.get("530454438008061962");
  if (!msg.member.roles.has(pelotaRol.id)) {
    return;
  } 
  
  if (arg[0] === 'register') {
    if (!/^<@[0-9]+>$/.test(arg[1])) {
      msg.channel.send(errmsg);
      return;
    }
    
    user.create({
      discordId: arg[1].replace(/<@/, '').replace(/>/, ''),
      osuUser: arg[2],
      mode: arg[3]
    }, (err, newuser) => {
      if (err) {
        msg.channel.send('Un error ha ocurrido.');
        return;
      }
      msg.channel.send(`El usuario para ${arg[1]} ha sido creado.`);
      return;
    }); 
  } else if (arg[0] === 'delete') {
    if (!(/^<@[0-9]+>$/.test(arg[1]))) {
      msg.reply(errmsg);
      return;
    }
    
    user.deleteOne({ discordId: arg[1] },(err) => {
      if (err) {
        msg.channel.send('Ha ocurrido un error');
      }
      msg.channel.send(`Se ha eliminado el usuario ${arg[1]}`);
    });
    return;
    
  } else if (arg[0] === 'list') {

    user.find((err, users) => {
      let resp = '';
      for (let u of users) {
        var level = 0;
        for (let n in niveles) {
          let i = niveles[n];
          if (u.exp >= i) {
            level = n;
          }
        }
        resp += `\n**Discord ID:** ${u.discordId}\n**Osu user:** ${u.osuUser}\n**Nivel:** ${names[level]} (${level})\n**Exp:** ${u.exp}/${niveles[Number(level) + 1]}\n**Modo:** ${u.mode}\n`
      }
      
      msg.channel.send(resp);
    });
    return;
  
  } else if (arg[0] === 'find') {
    var fdoc = { osuUser: arg[1] };
    if (/^<@[0-9]+>$/.test(arg[1])) {
      fdoc = { discordId: arg[1].replace(/<@/, '').replace(/>/, '') };
    }

    user.findOne(fdoc, (err, u) => {
      if (!u) {
        msg.channel.send(`${arg[1]} no está registrado.`);
        return;
      }

      var level = 0;
      for (let n in niveles) {
        let i = niveles[n];
        if (u.exp >= i) {
          level = n;
        }
      }
  
      const target = msg.guild.members.get(u.discordId).user;
      const embed = new Discord.RichEmbed()
      .setColor(0xff5900)
      .setAuthor(target.username, target.avatarURL)
      .setThumbnail(badges[level])

      .addField(`💎**Nivel:**`, `${names[level]}`, true)
      .addField(`✨**Experiencia:**`, u.exp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), true)
      .addField(`🎮**Modo de juego:**`, `${u.mode === 'std' ? 'Standard' : 'Mania'}`, true)
      .addField(`❓**Quests completadas:**`, u.quests, true)
      .addField(`㊙**Usuario osu (oculto):**`, u.osuUser, true)
    
      .setFooter('© Osu!Crew || 2.0')

    msg.channel.send({embed});
    
    });
    return;
  
  }
}
