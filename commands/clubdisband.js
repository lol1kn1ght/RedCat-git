const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    var clubs = db.collection(`clubs`);
    let clubData = await clubs
      .find({
        owner: message.author.id
      })
      .toArray();
    let club = clubData[0];
    if (!club) return f.msgFalse(message, `У вас не существует клуба.`);
    let acceptMsg = await message.channel.send(
      `Вы уверены, что хотите удалить ваш клуб?`
    );

    (async () => {
      await acceptMsg.react(`✅`);
      await acceptMsg.react(`❌`);
    })();

    let accessReaction = await acceptMsg
      .awaitReactions(
        (reaction, user) =>
          [`✅`, `❌`].includes(reaction.emoji.name) &&
          user.id === message.author.id,
        {
          max: 1,
          time: 600000,
          errors: [`time`]
        }
      )
      .catch(e => {
        f.msgFalse(message, `Вы отказались.`);
        return;
      });

    accessReaction = accessReaction.first();
    if (accessReaction.emoji.name === `✅`) {
      clubs.deleteOne({
        owner: club.owner
      });

      // var refundCost = Math.floor(club.money / 2);
      // if (club.money > 25000) {
      //   bot.addMoney(db.collection(`users`), club.owner, refundCost);
      //   bot.economyLogs(
      //     bot,
      //     `+`,
      //     bot,
      //     message.member,
      //     refundCost,
      //     `Возврат средств за клуб.`
      //   );
      // }
      // bot
      //   .msg(
      //     `Вы успешно удалили **${club.name}**.${
      //       club.money > 25000
      //         ? `\nНа ваш счет было возвращено **${bot.discharge(
      //             refundCost
      //           )}${moneyIcon}**`
      //         : ""
      //     }`
      //   )
      //   .then(msgAccept => {
      //     msgAccept.react(`:press_f:587001655971545125`);
      //   });
      acceptMsg.reactions.removeAll();
      f.msg(message, "Вы успешно удалили свой клуб.");
    } else if (accessReaction.emoji.name === `❌`) {
      f.msg(message, `Вы отказались.`);
    }
  }

  #getOptions() {
    return {
      aliases: "clubdisband",
      description: "удалить свой клуб",
      enabled: true,
      type: "Клубы",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "clubdisband club-disband",
      description: this.options.description
    };
  }
}
module.exports = Command;
