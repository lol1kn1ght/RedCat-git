const Canvas = require('canvas');

class Command {
  constructor() {
    this.options = this.#getOptions();
  }

  async execute(bot, message, args, mongo) {

    const { channel, guild, member } = message

    if (!["581181840832987176"].includes(guild.id)) return
    if (!["761208877004881951"].includes(channel.id)) return

    const role = `603202801631363075`

    const alreadyHasRole = member._roles.includes(role);
    if (!alreadyHasRole) return

    let usercoordinate = []
    let i = 0

    const map = [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [7, 0],
      [8, 0],
      [9, 0],
      [10, 0],
      [11, 0],
      [12, 0],
      [13, 0],
      [14, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
      [5, 1],
      [6, 1],
      [7, 1],
      [8, 1],
      [9, 1],
      [10, 1],
      [11, 1],
      [12, 1],
      [13, 1],
      [14, 1],
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 2],
      [6, 2],
      [7, 2],
      [8, 2],
      [9, 2],
      [10, 2],
      [11, 2],
      [12, 2],
      [13, 2],
      [14, 2],
      [0, 3],
      [1, 3],
      [2, 3],
      [3, 3],
      [4, 3],
      [5, 3],
      [6, 3],
      [7, 3],
      [8, 3],
      [9, 3],
      [10, 3],
      [11, 3],
      [12, 3],
      [13, 3],
      [14, 3],
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
      [4, 4],
      [5, 4],
      [6, 4],
      [7, 4],
      [8, 4],
      [9, 4],
      [10, 4],
      [11, 4],
      [12, 4],
      [13, 4],
      [14, 4],
      [0, 5],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
      [5, 5],
      [6, 5],
      [7, 5],
      [8, 5],
      [9, 5],
      [10, 5],
      [11, 5],
      [12, 5],
      [13, 5],
      [14, 5],
      [0, 6],
      [1, 6],
      [2, 6],
      [3, 6],
      [4, 6],
      [5, 6],
      [6, 6],
      [7, 6],
      [8, 6],
      [9, 6],
      [10, 6],
      [11, 6],
      [12, 6],
      [13, 6],
      [14, 6],
      [0, 7],
      [1, 7],
      [2, 7],
      [3, 7],
      [4, 7],
      [5, 7],
      [6, 7],
      [7, 7],
      [8, 7],
      [9, 7],
      [10, 7],
      [11, 7],
      [12, 7],
      [13, 7],
      [14, 7],
      [0, 8],
      [1, 8],
      [2, 8],
      [3, 8],
      [4, 8],
      [5, 8],
      [6, 8],
      [7, 8],
      [8, 8],
      [9, 8],
      [10, 8],
      [11, 8],
      [12, 8],
      [13, 8],
      [14, 8],
      [0, 9],
      [1, 9],
      [2, 9],
      [3, 9],
      [4, 9],
      [5, 9],
      [6, 9],
      [7, 9],
      [8, 9],
      [9, 9],
      [10, 9],
      [11, 9],
      [12, 9],
      [13, 9],
      [14, 9],
      [0, 10],
      [1, 10],
      [2, 10],
      [3, 10],
      [4, 10],
      [5, 10],
      [6, 10],
      [7, 10],
      [8, 10],
      [9, 10],
      [10, 10],
      [11, 10],
      [12, 10],
      [13, 10],
      [14, 10],
      [0, 11],
      [1, 11],
      [2, 11],
      [3, 11],
      [4, 11],
      [5, 11],
      [6, 11],
      [7, 11],
      [8, 11],
      [9, 11],
      [10, 11],
      [11, 11],
      [12, 11],
      [13, 11],
      [14, 11],
      [0, 12],
      [1, 12],
      [2, 12],
      [3, 12],
      [4, 12],
      [5, 12],
      [6, 12],
      [7, 12],
      [8, 12],
      [9, 12],
      [10, 12],
      [11, 12],
      [12, 12],
      [13, 12],
      [14, 12],
      [0, 13],
      [1, 13],
      [2, 13],
      [3, 13],
      [4, 13],
      [5, 13],
      [6, 13],
      [7, 13],
      [8, 13],
      [9, 13],
      [10, 13],
      [11, 13],
      [12, 13],
      [13, 13],
      [14, 13],
      [0, 14],
      [1, 14],
      [2, 14],
      [3, 14],
      [4, 14],
      [5, 14],
      [6, 14],
      [7, 14],
      [8, 14],
      [9, 14],
      [10, 14],
      [11, 14],
      [12, 14],
      [13, 14],
      [14, 14],
    ]

    const walls = [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
      [1, 6],
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
      [3, 5],
      [3, 6],
      [4, 0],
      [4, 6],
      [5, 0],
      [5, 1],
      [5, 2],
      [5, 3],
      [5, 4],
      [5, 5],
      [5, 6],
      [7, 0],
      [7, 1],
      [7, 2],
      [7, 3],
      [7, 4],
      [7, 5],
      [8, 6],
      [9, 0],
      [9, 1],
      [9, 2],
      [9, 3],
      [9, 4],
      [9, 5],
      [11, 0],
      [11, 1],
      [11, 2],
      [11, 3],
      [11, 4],
      [11, 5],
      [11, 6],
      [12, 0],
      [12, 3],
      [12, 6],
      [13, 0],
      [13, 3],
      [13, 6],
      [2, 8],
      [2, 9],
      [2, 10],
      [2, 11],
      [2, 12],
      [2, 13],
      [3, 8],
      [3, 13],
      [5, 9],
      [5, 10],
      [5, 11],
      [5, 12],
      [5, 13],
      [6, 8],
      [6, 11],
      [7, 9],
      [7, 10],
      [7, 11],
      [7, 12],
      [7, 13],
      [9, 8],
      [10, 8],
      [10, 9],
      [10, 10],
      [10, 11],
      [10, 12],
      [10, 13],
      [11, 8]
    ]

    const red = [
      [12, 13]
    ]

    const canvas = Canvas.createCanvas(700, 700)
    const ctx = canvas.getContext('2d')

    map.forEach(([x, y]) => {
      ctx.fillStyle = '#918f8a'
      ctx.fillRect(x * 50, y * 50, 50, 50)
    })

    walls.forEach(([x, y]) => {
      ctx.fillStyle = '#5e5c5b'
      ctx.fillRect(x * 50, y * 50, 50, 50)
    })

    red.forEach(([x, y]) => {
      ctx.fillStyle = '#923200'
      ctx.fillRect(x * 50, y * 50, 50, 50)
    })

    const embed = new Discord.EmbedBuilder()
      .setTitle('Побег из собачника')
      .setDescription(`Ожидайте, спавна карты 💫`)
      .setFooter({
        text: 'Вам нужно дойти до выхода (красный кубик)'
      })
      .setImage(`attachment://welcome.png`);

    const row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
          .setCustomId('down')
          .setEmoji("⬇️")
          .setStyle("PRIMARY"),
        new Discord.ButtonBuilder()
          .setCustomId('left')
          .setEmoji("⬅️")
          .setStyle("PRIMARY"),
        new Discord.ButtonBuilder()
          .setCustomId('right')
          .setEmoji("➡️")
          .setStyle("PRIMARY"),
        new Discord.ButtonBuilder()
          .setCustomId('up')
          .setEmoji("⬆️")
          .setStyle("PRIMARY"),
      );


    await message.reply({
      embeds: [embed],
      files: [new Discord.AttachmentBuilder(canvas.toBuffer(), `welcome.png`)],
      components: [row],
      allowedMentions: {
        repliedUser: false
      }
    })
      .then(async (displayMessage) => {

        const movement = (x, y) => {
          if (y >= 14 || x >= 14 || x <= -1 || y <= -1) {
            return
          }
          if (walls.some(([wallsX, wallsY]) => wallsX === x && wallsY === y)) {
            return
          }


          ctx.fillStyle = '#ffffff'
          ctx.fillRect(x * 50, y * 50, 50, 50)

          ctx.fillStyle = '#918f8a'
          ctx.fillRect(usercoordinate[0] * 50, usercoordinate[1] * 50, 50, 50)


          usercoordinate = []
          usercoordinate = [x, y]

          i++

          displayMessage.removeAttachments()

          embed.setDescription(`Вы *(белый квадрат)* находитесть тут: **${usercoordinate[0]}, ${usercoordinate[1]}**`)
          embed.setImage(`attachment://welcome-${i}.png`);
          displayMessage.edit({
            embeds: [embed],
            files: [new Discord.AttachmentBuilder(canvas.toBuffer(), `welcome-${i}.png`)]
          })
        }

        setTimeout(() => {
          movement(0, 7)
        }, 1000)

        const filter = i => i.user.id === message.author.id;

        const collector = displayMessage.createMessageComponentCollector({
          filter,
          componentType: "BUTTON",
        });

        const embed2 = new Discord.EmbedBuilder()
          .setTitle('Вы успешно сбежали с собачника!')
          .setColor(`#ffae42`)
          .setImage(`https://cdn.discordapp.com/attachments/627928404221624323/978988134878572554/ezgif-4-0f99ac6458.gif`)

        collector.on('collect', async button => {
          if (button.customId === 'down') {
            button.deferUpdate()
            movement(usercoordinate[0], usercoordinate[1] + 1)

            if (usercoordinate[0] === 12 && usercoordinate[1] === 13) {
              button.member.send({
                embeds: [embed2]
              }).catch()
              button.member.roles.remove(guild.roles.cache.find(r => r.id === role.toString().replace(/[^\w\s]/gi, ''))).catch()
              await button.channel.send(`\`${button.member.displayName}\` Успешно сбежал!`)
              button.message.delete().catch()
            }
          } else if (button.customId === 'left') {
            button.deferUpdate()
            movement(usercoordinate[0] - 1, usercoordinate[1])

            if (usercoordinate[0] === 12 && usercoordinate[1] === 13) {
              button.member.send({
                embeds: [embed2]
              }).catch()
              button.member.roles.remove(guild.roles.cache.find(r => r.id === role.toString().replace(/[^\w\s]/gi, ''))).catch()
              await button.channel.send(`\`${button.member.displayName}\` Успешно сбежал!`)
              button.message.delete().catch()
            }
          } else if (button.customId === 'right') {
            button.deferUpdate()
            movement(usercoordinate[0] + 1, usercoordinate[1])

            if (usercoordinate[0] === 12 && usercoordinate[1] === 13) {
              button.member.send({
                embeds: [embed2]
              }).catch()
              button.member.roles.remove(guild.roles.cache.find(r => r.id === role.toString().replace(/[^\w\s]/gi, ''))).catch()
              await button.channel.send(`\`${button.member.displayName}\` Успешно сбежал!`)
              button.message.delete().catch()
            }
          } else if (button.customId === 'up') {
            button.deferUpdate()
            movement(usercoordinate[0], usercoordinate[1] - 1)

            if (usercoordinate[0] === 12 && usercoordinate[1] === 13) {
              button.member.send({
                embeds: [embed2]
              }).catch()
              button.member.roles.remove(guild.roles.cache.find(r => r.id === role.toString().replace(/[^\w\s]/gi, ''))).catch()
              await button.channel.send(`\`${button.member.displayName}\` Успешно сбежал!`)
              button.message.delete().catch()
            }
          }
        });

      })

  }

  #getOptions() {
    return {
      aliases: ";runaway",
      description: "команда для побега из собачника",
      usage: ";runaway",
      enabled: true,
      type: "Развлечения",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: ["603202801631363075"],
    };
  }

}
module.exports = Command;
