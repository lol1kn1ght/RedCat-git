const {MessageEmbed} = require("discord.js");

module.exports = function({amount, member_for, member_by, type, reason, final_coins}) {
  if (!member_for || !member_by || !type || !reason)
    throw new Error("Недостаточно аргументов.");

  if (isNaN(Number(amount))) throw new Error("Сумма должна быть числом.");

  if (isNaN(Number(final_coins))) throw new Error("Финальная сумма должна быть числом.")

  let logs_channel = bot.channels.cache.get("654719623371161620");

  if (!logs_channel) throw new Error("Канал для логов не найден.");

  let logs_embed = new MessageEmbed()
    .setDescription(
      `\`Пользователь\`: ${member_for.user} (\`${member_for.user?.tag}\` ID: ${
        member_for.id
      })\n\`Сумма\`: ${type + "" + f.discharge(amount)}${
        f.currency
      }\n\`Баланс\`: ${f.discharge(final_coins)}${
        f.currency
      }\n\`Причина\`: ${reason}\n\`Кем\`: \`${member_by.user.tag}\` (ID: ${
        member_by.id
      })`
    )
    .setTitle("Изменение баланса")
    .setColor(type === "+" ? "GREEN" : "RED");

  logs_channel.send({embeds: [logs_embed]});
};
