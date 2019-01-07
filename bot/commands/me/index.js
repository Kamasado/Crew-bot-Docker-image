const fs = require('fs');
const user = require('../../userModel');
const Discord = require('discord.js');
const niveles = JSON.parse(fs.readFileSync('commands/user/niveles.json'));
const names = JSON.parse(fs.readFileSync('commands/user/names.json'));
const badges = JSON.parse(fs.readFileSync('commands/badges.json'));
const levelrole = JSON.parse(fs.readFileSync('commands/levelrole.json'));

const errmsg = 'Sintaxis incorrecta.\nEscribe **-ayuda me** para más información';

function valid(arg) {
  if (arg.length > 1) {
    return false;
  }
  return true;
}

module.exports = (arg, msg) => {
  if (!valid(arg)) {
    msg.channel.send(errmsg);
    return;
  }
  
  var mode = arg[0] === 'mania' ? 'mania' : arg[0] === 'std' ? 'std' : 'none';
  
  const id = msg.author.id;
  
  user.find({ discordId: id }, (err, u) => {
    if (u.length === 0) {
      let embed = new Discord.RichEmbed()
        .setColor(0xff5900)
        .setAuthor(msg.author.username, msg.author.avatarURL)
     

        .addField('¡No estas registrado!', 'Contacta con un <@&530454438008061962> para comenzar.')

        .setFooter('© Osu!Crew || 2.0')
      msg.channel.send(embed);
      return;
    }
    
    u = mode === 'none' ? u[0] : u[u[0].mode === mode ? 0 : 1];
    
    var level = 0;
      for (let n in niveles) {
        let i = niveles[n];
        if (u.exp >= i) {
          level = n;
        }
      }
    
    const totalExp = niveles[Number(level) + 1];
    
    const embed = new Discord.RichEmbed()
      .setColor(0xff5900)
      .setAuthor(msg.author.username, msg.author.avatarURL)
      .setThumbnail(badges[level])

      .addField(`💎**Nivel:**`, `${names[level]}`, true)
      .addField(`✨**Experiencia:**`, `${u.exp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}/${totalExp ? totalExp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '∞'}`, true)
      .addField(`🎮**Modo de juego:**`, `${u.mode === 'std' ? 'Standard' : 'Mania'}`, true)
      .addField(`❓**Quests completadas:**`, u.quests, true)
    
      .setFooter('© Osu!Crew || 2.0')

    
    msg.channel.send({embed});
    
    if (level == 0) return;
   
   
    const trueRole = levelrole[u.mode][level];  

    for (let r in levelrole[u.mode]) {
      const loopRole = levelrole[u.mode][r];
      
    
      
      if ( (msg.member.roles.has(loopRole)) && (loopRole !== trueRole) ) {
        msg.member.removeRole(loopRole).catch(console.error);
      }
    
      if (loopRole === trueRole) {
        msg.member.addRole(loopRole).catch(console.error);
      }
    }
  });
}
