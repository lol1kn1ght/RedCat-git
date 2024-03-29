const f = require("../config/modules");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);
    var member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    var clubName;
    if (!member) {
      clubName = args.join(` `).toLowerCase();
    }
    if (!args[0]) member = message.member;
    var clubs = db.collection(`clubs`);
    var clubData = (await clubs.find().toArray()) || [];

    if (member)
      var club = clubData.filter(
        (val) => val && val?.members?.includes(member.id)
      )[0];
    else
      var club = clubData.filter(
        (val) => val.name.toLowerCase() === clubName.toLowerCase()
      )[0];
    if (member) {
      if (!club)
        return f.msgFalse(
          message,
          `У **${member.user.tag}** отсутствует клуб.`
        );
    } else {
      if (!club) return f.msgFalse(message, `Указанного клуба не существует.`);
    }

    var clubOwner = message.guild.members.cache.get(club.owner);
    if (!clubOwner) return f.msgFalse(message, `Такого клуба не существует.`);
    if (!club.admins) club.admins = [];
    for (let admin of club.admins) {
      let userAdmin = message.guild.members.cache.get(admin);
      if (!userAdmin) club.admins.splice(club.admins.indexOf(admin), 1);
    }
    var membersFilter = club.members.filter(
      (val) => !club.admins.includes(val) && val !== club.owner
    );
    var membersArr = club.admins.concat(membersFilter);
    var fieldsArr = [];
    var i = 0;
    var page = 0;
    for (let userId of membersArr) {
      var user = message.guild.members.cache.get(userId);
      if (!user) {
        club.members.splice(club.members.indexOf(userId), 1);
        continue;
      }
      var members = `\`${user.user.tag}\`${
        user.id === club.owner
          ? `:star_struck:`
          : club.admins.includes(user.id)
          ? ":star:"
          : ""
      }\n`;
      if (fieldsArr[page]) fieldsArr[page] += members;
      else fieldsArr.push(members);
      i++;
      if (i >= 10) {
        page++;
        i = 0;
      }
    }

    let club_role = message.guild.roles.cache.get(club.role);

    const embed = new Discord.MessageEmbed()
      .setTitle(club.name)
      .setThumbnail(clubOwner.user.displayAvatarURL({ dynamic: true }))
      .addField(`:star: Овнер:`, clubOwner.user.tag, true)
      .addField(
        `:money_with_wings: Копилка:`,
        f.discharge(club.money ? club.money : 0) + f.currency,
        true
      )
      .addField(
        `:fish_cake: Клубная роль:`,
        `${club.role ? message.guild.roles.cache.get(club.role) : `Нет.`}`
      )
      .addField(
        `:bellhop: Клубный канал:`,
        `${club.channel ? `Есть.` : `Нет.`}`
      )
      .addField(":notepad_spiral: Описание:", club.description || `Нет.`)
      .setColor(club_role ? club_role?.color : f.config.defColor);
    try {
      embed.setImage(club.image);
    } catch (e) {}
    var pages = [];
    var i = 1;
    for (let field of fieldsArr) {
      var pageEmbed = new Discord.MessageEmbed(embed);
      pageEmbed.addField(
        `:busts_in_silhouette: Участники (${club.members.length}): `,
        `\n${
          membersArr.length === 0
            ? `А зачем больше участников? Одному тоже хорошо.`
            : field
        }`
      );
      pageEmbed.setFooter(`Страница: ${i++} из ${fieldsArr.length}`);
      pages.push(pageEmbed);
    }
    if (!pages[0]) {
      embed.addField(
        `:busts_in_silhouette: Участники (${club.members.length}): `,
        `\n${
          membersArr.length === 0
            ? `А зачем больше участников? Одному тоже хорошо.`
            : field
        }`
      );
      pages.push(embed);
    }

    var currentPage = 0;

    clubs.updateOne(
      {
        owner: club.owner,
      },
      {
        $set: {
          members: club.members,
          admins: club.admins,
        },
      }
    );

 if (pages.length === 1) {
            message.channel.send({ embeds: [pages[0]] })
        } else {

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setStyle("PRIMARY")
                .setLabel("Назад")
                .setCustomId("back"),

            new MessageButton()
                .setStyle("PRIMARY")
                .setLabel("Вперед")
                .setCustomId("next"),
        )

        var menuMsg = await message.channel.send({ embeds: [pages[0]], components: [row] });
        currentPage = 0
        const filter = (interaction) => {
            if (interaction.user.id === message.author.id) return true;
            return interaction.reply({
                content: `Только ${message.member.displayName} может использовать это!`,
                ephemeral: true,
            });
        };

        const collector = menuMsg.createMessageComponentCollector({
            filter,
            componentType: "BUTTON",
            time: 1000 * 60 * 3
        })

        collector.on("collect", async (interaction) => {
            if (interaction.customId === "back") {
                if (currentPage - 1 < 0) {
                    interaction.deferUpdate()
                }
                else {
                    currentPage--
                    interaction.update({ embeds: [pages[currentPage]], components: [row] })
                }
            }

            if (interaction.customId === "next") {
                if (!pages[currentPage + 1]) {
                    interaction.deferUpdate()
                }
                else {
                    currentPage++
                    interaction.update({ embeds: [pages[currentPage]], components: [row] })
                }
            }
        })

        collector.on(`end`, interaction => {
            menuMsg.edit({ components: [] })
        });
          }
}

  #getOptions() {
    return {
      aliases: "clubinfo",
      description: "посмотреть информацию о вашем или чужом клубе",
      enabled: true,
      type: "Клубы",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "club-info",
      description: this.options.description,
    };
  }
}
module.exports = Command;
