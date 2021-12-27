const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    let clubs_db = db.collection("clubs");
    let clubs_data = await clubs_db.find().toArray();

    let club = clubs_data.filter(
      club =>
        club.owner === message.author.id ||
        club.admins?.includes(message.author.id)
    )[0];
    if (!club) return f.msgFalse(message, "Вы не управляете никаким клубом.");

    if (!club.requests || !club.requests[0])
      return f.msgFalse(message, "Список заявок пуст.");

    let club_role = message.guild.roles.cache.get(club?.role);

    let pages = [];
    let current_page = 0;
    let count = 1;

    for (let request of club.requests) {
      let member = message.guild.members.cache.get(request);

      if (!member) continue;

      let field = `${member.user.tag}\n`;

      if (pages[current_page]) pages[current_page] += field;
      else pages[current_page] = field;

      if (count >= 10) {
        count = 0;
        current_page++;
      }

      count++;
    }

    console.log(pages);

    let num = 1;
    let embeds = [];

    for (let page of pages) {
      let pages_embed = new Discord.MessageEmbed()
        .setTitle(`Список заявок в клуб ${club.name}:`)
        .setDescription(page)
        .setFooter(`Страница ${num++} из ${pages.length}`)
        .setColor(club_role?.color);

      embeds.push(pages_embed);
    }

    f.pages_menu(
      message,
      embeds,
      180000,
      msg => msg.author.id === message.author.id
    );
  }

  #getOptions() {
    return {
      aliases: "clubapps",
      description: "просмотреть список забаненных участников в вашем клубе",
      enabled: true,
      type: "Клубы",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "clubbans",
      description: this.options.description
    };
  }
}
module.exports = Command;
