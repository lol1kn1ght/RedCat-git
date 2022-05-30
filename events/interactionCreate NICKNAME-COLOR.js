const {MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");

class Event {
  constructor() {}

  async execute(bot, mongo, interaction) {
if (!interaction.isSelectMenu()) return;
 if (interaction.channel.id != "849152752189964348") return;
if (bot.channels.cache.get("849152752189964348")) {

      if (
        !(
          interaction.member.roles.cache.has("650616098957295627") ||
          interaction.member.roles.cache.has("849252190659936266")
        )
      ) {
        interaction.reply({
          content: `Для использования у вас должна быть роль <@&650616098957295627> или <@&849252190659936266>`,
          ephemeral: true
        });
        return;
      }

      const value = interaction.values[0];

      let role = interaction.guild.roles.cache.get(value);

      let color_roles = [
        "849199103183159337",
        "849199325145464852",
        "849199718214270977",
        "849199897818562620",
        "849200092082208800",
        "849200344642748487",
        "849228126021353492",
        "849229723213103114",
        "849200547605119056",
        "849200726878060574",
        "849200900668653569",
        "849222899655376896",
        "849201075822133298",
        "849201401171411004",
        "849219516676440084",
        "849201226700685333",
        "849201639235911720",
        "849201815073194014",
        "849228821373648917",
        "849221206217719808"
      ];

      let reply_content = "";

      if (color_roles.indexOf(value) !== -1) {
        await interaction.member.roles.remove(color_roles);
        await interaction.member.roles.add(role);
        reply_content = `Выдана роль ${role}`;
      } else {
        if (value === "No_color_role_cat") {
          await interaction.member.roles.remove(color_roles);
          reply_content = `Ваш никнейм девственно чист!`;
        } else return;
      }

      await interaction.reply({
        content: reply_content,
        ephemeral: true
      });

      await interaction.guild.roles.fetch();

      let msg = await bot.channels.cache
        .get("849152752189964348")
        .messages.fetch("849249739799396402");

      let embed_description =
        '<@&650616098957295627> и <@&849252190659936266> (покупатели товара "Цветной никнейм" в магазине (`;shop` в <#643032168884600834>)) имеют возможность выбрать цвет никнейма из представленных ниже.\n';
      for (let index = 0; index < color_roles.length; ++index) {
        embed_description += `**•** <@&${color_roles[index]}> [ ${
          interaction.guild.roles.cache.get(color_roles[index]).members.size
        } ]\n`;
      }

  const select_role_cat = color_roles.map((id) => {
                const role_cat = interaction.guild.roles.cache.get(id);
                return {
                    label: role_cat.name,
                    value: role_cat.id,
                }
            });

 select_role_cat.push({
                label: "Снять с себя цветную роль ❌",
                value: "No_color_role_cat"
            });

      const Embed = new MessageEmbed()
        .setTitle("Цвет ника")
        .setDescription(embed_description)
        .setColor(`#eced6d`);

  const color_roles_cat_row = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId('color_roles_cat')
                    .setPlaceholder(`Нажмите, чтобы выбрать цвет`)
                    .addOptions(select_role_cat)
            );

      await msg.edit({embeds: [Embed], components: [color_roles_cat_row]});

    }
  }
}
module.exports = (...args) => {
  new Event().execute(...args);
};
