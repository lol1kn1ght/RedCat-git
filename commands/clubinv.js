const {pages_menu} = require("../config/modules");
const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);

    let club_name = args.join(" ");

    let clubs_db = db.collection("clubs");
    let clubs_data = await clubs_db.find().toArray();
    let items_db = db.collection("clubs_shop");
    let items_data = await items_db.find().toArray();

    // let users_db = db.collection("users");
    // let user_data = await users_db.find({login: message.author.id}).toArray();
    // let user  = user_data[0] || {}
    //
    // if (!user.)

    let club;

    if (club_name) {
      let club_filter = clubs_data.filter(
        club => club.name.toLowerCase() === club_name.toLowerCase()
      )[0];
      if (!club_filter) {
        club_filter = clubs_data.filter(club =>
          club.members.includes(message.member.id)
        )[0];
      }

      club = club_filter;
    } else {
      let club_filter = clubs_data.filter(club =>
        club.members.includes(message.member.id)
      )[0];
      if (club_filter) club = club_filter;
    }

    if (!club)
      return f.msgFalse(
        message,
        "Вы не состоите в клубе или указанного клуба не существует."
      );
    let club_owner = message.guild.members.cache.get(club.owner);
    if (!club_owner)
      return f.msgFalse(
        message,
        "Ваш клуб недоступен потому что владелец клуба не находится на сервере."
      );

    if (!club.inventory || !club.inventory[0])
      return f.msgFalse(message, `Инвентарь **${club.name}** пуст.`);
    let inventory = club.inventory;
    let inventory_id = inventory.map(item => item.id);

    let items = items_data.filter(item => inventory_id.includes(item.id));

    let pages = [];
    let curr_page = 0;
    let count = 1;
    let embeds = [];
    let pages_count = 1;

    for (let item of items) {
      let current_item = inventory.filter(
        inv_item => inv_item.id === item.id
      )[0];

      let item_field = {
        name: `\n${item.name} - **${f.discharge(current_item.amount)} шт.**`,
        value: item.description || "Пусто."
      };
      if (pages[curr_page]) pages[curr_page].push(item_field);
      else pages[curr_page] = [item_field];

      count++;
      if (count > 10) {
        count = 0;
        curr_page++;
      }
    }

    for (let page of pages) {
      let page_embed = new Discord.MessageEmbed({
        title: `Инвентарь клуба ${club.name}:`,
        fields: page,
        description: `Пропишите \`${f.prefix}club-use (название предмета)\` для его использования.`,
        footer: {
          text: `Страница ${pages_count++} из ${pages.length}`
        },
        color: f.config.defColor,
        thumbnail: {
          url: club_owner.user.displayAvatarURL({dynamic: true})
        }
      });

      embeds.push(page_embed);
    }

    f.pages_menu(
      message,
      embeds,
      18000,
      (reaction, user) => user.id === message.author.id
    );
  }

  #getOptions() {
    return {
      aliases: "clubinv club-inventory",
      description: "проверить ваш инвентарь",
      usage: "inv (упоминание участника)",
      enabled: true,
      type: "Магазин Клубов",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "club-inventory",
      description: this.options.description
    };
  }
}
module.exports = Command;
