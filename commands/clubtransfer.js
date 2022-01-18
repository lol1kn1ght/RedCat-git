class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    let member =
      message.mentions.members.first() ||
      (await message.guild.members.fetch(args[0]));

    if (!member)
      return f.msgFalse(message, "Вы не указали нового владельца клуба?");

    if (member.user.bot || member.id === message.author.id)
      return f.msgFalse(message, "Вы указали неправильного пользователя.");

    let clubs_db = db.collection("clubs");
    let club = await clubs_db.findOne({ owner: message.author.id });

    if (!club) return f.msgFalse(message, "Вы не владеете никаким клубом.");

    if (!club.members.includes(member.id))
      return f.msgFalse(
        message,
        "Указанный участник не находится в вашем клубе."
      );

    let ask_message = await f.msg(
      message,
      `Вы уверены что хотите передать клуб участнику **${member.user.tag}**?\n\n\`Напишите название клуба что бы подтвердить...\``
    );

    let ans = await message.channel
      .awaitMessages({
        filter: (msg) => msg.author.id === message.author.id,
        max: 1,
        time: 180000,
        errors: ["time"],
      })
      .catch((e) => {
        f.msgFalse(message, "Вы не подтвердили.");
        return;
      });

    if (!ans.first()) f.msgFalse(message, "Вы не подтвердили.");

    if (ans.first().content.toLowerCase() != club.name.toLowerCase())
      return f.msgFalse(message, "Вы неправильно указали название клуба.");

    clubs_db.updateOne(
      {
        owner: message.author.id,
      },
      {
        $set: {
          owner: member.id,
        },
      }
    );

    f.msg(
      message,
      `Вы успешно передали управление клубом **${club.name}** участнику **${member.user.tag}**`
    );
  }

  #getOptions() {
    return {
      aliases: "clubtransfer",
      description: "Передать владельца клуба другому участнику",
      enabled: true,
      type: "Клубы",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "club-transfer",
      description: this.options.description,
    };
  }
}
module.exports = Command;
