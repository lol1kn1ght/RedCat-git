const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    let member =
      message.guild.members.cache.get(args[0]) ||
      message.mentions.members.first() ||
      message.guild.members.cache.find(
        guild_member =>
          guild_member.user.tag.toLowerCase() === args.join(" ").toLowerCase()
      );

    if (!member) return f.msgFalse(message, "Вы не указали участника.");

    if (message.author.id === member.id)
      return f.msgFalse(message, "Вы не можете забанить самого себя.");

    let clubs_db = db.collection("clubs");
    let clubs_data = await clubs_db.find().toArray();
    let club = clubs_data.filter(
      club =>
        club.owner === message.author.id ||
        club.aminds?.includes(message.author.id)
    )[0];

    if (!club) return f.msgFalse(message, "Вы не управляете никаким клубом.");

    if (member.id === club.owner)
      return f.msgFalse(message, "Вы не можете забанить овнера клуба.");

    if (club.admins?.includes(member.id) && message.author.id !== club.owner)
      return f.msgFalse(
        message,
        "Только владелец клуба может банить админов клуба."
      );

    if (club.banneds?.includes(member.id))
      return f.msgFalse(
        message,
        "Указанный участник уже забанен в вашем клубе."
      );

    let all_members = club.members.concat(club.admins, [club.owner]);

    // if (!all_members.includes(member.id))
    //   return f.msgFalse(
    //     message,
    //     `Указанный участник не состоит в вашем клубе.`
    //   );

    if (club.members.includes(member.id)) {
      club.members.splice(club.members.indexOf(member.id), 1);
      let club_role = message.guild.roles.cache.find(
        role => role.id == club.role
      );

      if (club_role && member.roles.cache.has(club_role.id))
        member.roles.remove(club_role);
    }

    if (club.admins?.includes(member.id))
      club.admins.splice(club.admins.indexOf(member.id), 1);

    club.banneds ? club.banneds.push(member.id) : (club.banneds = [member.id]);

    clubs_db.updateOne(
      {
        owner: club.owner
      },
      {
        $set: {
          admins: club.admins,
          members: club.members,
          banneds: club.banneds
        }
      }
    );

    f.msg(message, `Вы успешно забанили **${member.user.tag}** в вашем клубе.`);
  }

  #getOptions() {
    return {
      aliases: "clubban",
      description: "забанить участника в своем клубе",
      enabled: true,
      type: "Клубы",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "clubban",
      description: this.options.description
    };
  }
}
module.exports = Command;
