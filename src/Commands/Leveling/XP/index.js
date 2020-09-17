const Discord = require('discord.js');
const Canvas = require('canvas');
const Vibrant = require('node-vibrant');

module.exports = class extends Command {
  constructor (...options) {
    super(...options, {
      name        : 'xp',
      aliases     : [
        'level',
      ],
      description : 'See how much **XP** you have.',
      args        : [
        {
          key  : 'user',
          type : 'user',
        },
      ],
      guildOnly   : true,
    });
  }

  async run (msg, args) {
    msg.channel.startTyping();
    const person = args.user || msg.author;
    if (person.bot) {
      return msg.channel.send(
        `${Utils.emojis.error} ${person} is a **bot!** They don't get to be in the topnotch **XP Club**.`,
      );
    }
    const manager = new this.client.database.managers.UserDB(person.id.toString());
    const score = await manager.fetchLevelingData(msg.guild.id.toString());
    if (score === undefined) {
      return msg.channel.send(`${Utils.emojis.error} **${person.username}** is not ranked yet...`);
    }
    // Create Canvas
    const { rank, lvl, goal, xp } = score;
    const canvas = Canvas.createCanvas(800, 243);
    const ctx = canvas.getContext('2d');
    // Rounded Rectangle
    function roundedRect (x, y, w, h, tl, tr, br, bl, color) {
      const r = x + w,
        b = y + h;
      ctx.beginPath();
      ctx.moveTo(x + tl, y);
      ctx.lineTo(r - tr, y);
      ctx.quadraticCurveTo(r, y, r, y + tr);
      ctx.lineTo(r, b - br);
      ctx.quadraticCurveTo(r, b, r - br, b);
      ctx.lineTo(x + bl, b);
      ctx.quadraticCurveTo(x, b, x, b - bl);
      ctx.lineTo(x, y + tl);
      ctx.quadraticCurveTo(x, y, x + tl, y);
      ctx.fillStyle = color;
      ctx.fill();
    }
    // Vars
    const avatar = await Canvas.loadImage(
      person.displayAvatarURL({
        format : 'png',
      }),
    );
    const medal = await Canvas.loadImage(process.cwd() + '/src/Assets/Images/Medal.png');
    const xpString = xp.abbreviate();
    const goalString = goal.abbreviate();
    const percent = xp / goal;
    // Background
    roundedRect(0, 0, 800, 243, 5, 5, 5, 5, '#2F3136');
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#2D2D32';
    roundedRect(35, 25, 730, 190, 5, 5, 5, 5, '#36393F');
    // Avatar
    const img = person.displayAvatarURL({
      format : 'png',
    });
    // Color from Avatar
    let color = 'rgb(0, 0, 0)';
    await Vibrant.from(img).getPalette((_err, palette) => {
      color = `rgb(${Math.floor(palette.Vibrant._rgb[0]) || '0'}, ${Math.floor(palette.Vibrant._rgb[1]) ||
        '0'}, ${Math.floor(palette.Vibrant._rgb[2]) || '0'})`;
    });
    // Progress Bar
    ctx.shadowBlur = 10;
    roundedRect(220, 140, 500, 30, 17, 17, 17, 17, '#424751');
    const width = percent * 500;
    ctx.shadowBlur = 0;
    roundedRect(
      220,
      140,

        width < 30 ? 30 :
        width,
      30,
      17,
      17,
      17,
      17,
      color,
    );
    // Name, Discriminator, Rank, Level
    ctx.font = 'bold 35px Manrope';
    ctx.fillStyle = color;
    const nameWidth = ctx.measureText(person.username).width;
    ctx.fillText(person.username, 220, 120);
    ctx.font = '24px Manrope';
    ctx.fillStyle = '#86888C';
    ctx.fillText(`#${person.discriminator}`, 225 + nameWidth, 120);
    ctx.textAlign = 'right';
    ctx.fillText(`/${goalString}`, 720, 120);
    const goalWidth = ctx.measureText(`/${goalString}`).width;
    ctx.fillStyle = '#fff';
    ctx.fillText(xpString, 720 - goalWidth, 120);
    ctx.font = 'bold 30px Manrope';
    ctx.fillText(lvl, 720, 60);
    const lvlWidth = ctx.measureText(lvl).width;
    ctx.font = '24px Manrope';
    ctx.fillStyle = '#86888C';
    ctx.fillText('LEVEL', 713 - lvlWidth, 60);
    const allLvlWidth = ctx.measureText('LEVEL').width + lvlWidth;
    ctx.font = 'bold 30px Manrope';
    ctx.fillStyle = '#fff';
    ctx.fillText(rank + 1, 706 - allLvlWidth, 60);
    const rankWidth = ctx.measureText(rank + 1).width + allLvlWidth;
    ctx.font = '24px Manrope';
    ctx.fillStyle = '#86888C';
    ctx.fillText('RANK', 699 - rankWidth, 60);
    // Medal if user is in top ten
    if (rank <= 9) {
      ctx.drawImage(medal, 150, 150, 60, 60);
    }
    // Draw Avatar
    ctx.beginPath();
    ctx.arc(140, 120, 60, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 80, 60, 120, 120);
    // Medal if user is in top ten
    if (rank <= 9) {
      ctx.drawImage(medal, 150, 150, 60, 60);
    }
    // Send the Canvas
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'rank.png');
    msg.channel.send(attachment).then(() => msg.channel.stopTyping());
  }
};
