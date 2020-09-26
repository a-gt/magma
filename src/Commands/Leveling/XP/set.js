const Discord = require('discord.js');
const Canvas = require('canvas');
const Vibrant = require('node-vibrant');

module.exports = class extends Command {
  constructor (...options) {
    super(...options, {
      name        : 'set',
      description : "Set people's XP.",
      args        : [
        {
          key      : 'user',
          name     : 'User',
          type     : 'user',
          required : true,
        },
        {
          key      : 'xpset',
          name     : 'XP',
          type     : 'number',
          required : true,
        },
      ],
      permissions : {
        user : 'mod',
      },
      guildOnly   : true,
    });
  }

  async run (msg, { user, xpset }) {
    if (xpset > 10000000) {
      return msg.channel.send(
        `${Utils.emojis.error} **${xpset.abreviate()}** is too high. Please choose something lower.`,
      );
    }
    // Set XP
    msg.channel.startTyping();
    if (user.bot) {
      return msg.channel.send(
        `${Utils.emojis
          .error} ${user} is a **bot!** They don't get to be in the topnotch **XP Club**. Therefore, you can't set their **XP**.`,
      );
    }
    const manager = new this.client.database.managers.UserDB(user.id.toString());
    await manager.setXP(msg.guild.id, xpset);
    // Create Canvas
    const person = user;
    const score = await manager.fetchLevelingData(msg.guild.id.toString());
    const { rank, lvl, goal, xp, background } = score;
    const canvas = Canvas.createCanvas(800, 243);
    const ctx = canvas.getContext('2d');
    // Functions
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
    function drawImageScaled (img) {
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.min(hRatio, vRatio);
      const centerShift_y = (canvas.height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, img.height, 0, centerShift_y, canvas.width, img.height * ratio);
    }
    // Vars
    const avatar = await Canvas.loadImage(
      person.displayAvatarURL({
        format : 'png',
      }),
    );
    const medal = await Canvas.loadImage(process.cwd() + '/src/Assets/Images/Medal.png');
    const bg = await Canvas.loadImage(background);
    const xpString = xp.abbreviate();
    const goalString = goal.abbreviate();
    const percent = xp / goal;
    // Background
    roundedRect(0, 0, 800, 243, 5, 5, 5, 5, 'rgb(0, 0, 0)');
    const r = 0 + 800,
      b = 0 + 243;
    ctx.beginPath();
    ctx.moveTo(0 + 5, 0);
    ctx.lineTo(r - 5, 0);
    ctx.quadraticCurveTo(r, 0, r, 0 + 5);
    ctx.lineTo(r, b - 5);
    ctx.quadraticCurveTo(r, b, r - 5, b);
    ctx.lineTo(0 + 5, b);
    ctx.quadraticCurveTo(0, b, 0, b - 5);
    ctx.lineTo(0, 0 + 5);
    ctx.quadraticCurveTo(0, 0, 0 + 5, 0);
    ctx.closePath();
    ctx.clip();
    drawImageScaled(bg);
    // Inner Background
    roundedRect(35, 25, 730, 190, 5, 5, 5, 5, 'rgba(0, 0, 0, 0.6)');
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
    // Send the Canvas and XP change
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'rank.png');
    msg.channel
      .send({
        files : [
          attachment,
        ],
        embed : {
          title       : '**XP** Change',
          color       : Utils.colors.burple,
          description : `Set <@${user.id}>'s **XP** to **${xpset.abbreviate()}**.\nHere is his/her rank:`,
          image       : {
            url : 'attachment://rank.png',
          },
          author      : {
            icon_url : msg.author.displayAvatarURL({
              format  : 'png',
              dynamic : true,
            }),
            name     : msg.author.tag,
          },
        },
      })
      .then(() => msg.channel.stopTyping());
  }
};
