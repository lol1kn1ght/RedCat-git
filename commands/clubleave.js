class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    let clubs_db = db.collection(`clubs`);
    let clubs_data = await clubs_db.find().toArray();

    let club = clubs_data.filter((val) =>
      val.members.includes(message.member.id)
    )[0];
    if (club.owner === message.member.id)
      return f.msgFalse(
        message,
        `Вы не можете выйти из клуба, который приднадлежит вам.`
      );

    club.members.splice(club.members.indexOf(message.member.id), 1);

    clubs_db.updateOne(
      {
        owner: club.owner,
      },
      {
        $set: {
          members: club.members,
        },
      }
    );
    f.msg(message, `Вы успешно покинули **${club.name}**`);
  }

  #getOptions() {
    return {
      aliases: "clubleave",
      description: "Выйти из клуба",
      enabled: true,
      type: "Клубы",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "clubleave",
      description: this.options.description,
    };
  }
}
module.exports = Command;
