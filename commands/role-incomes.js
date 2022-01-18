const f = require("../config/modules");
const pagesMenu = require("../functions/pagesMenu");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);

    let items_db = db.collection("income");
    let items_data = await items_db.find().sort({ income: -1 }).toArray();
    if (!items_data[0]) return f.msgFalse(message, "Ролей с заработком нет.");
    let pages = [];
    let curr_page = 0;
    let count = 1;
    let embeds_pages = [];
    let item_pos = 1;

    for (let item of items_data) {
      let role = message.guild.roles.cache.get(item.role);
      if (!role) continue;
      let item_field = {
        name: `${item_pos++}. ${role.name} `,
        value: `**${f.discharge(item.income)}**${f.currency}`,
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
        title: "Заработок ролей:",
        thumbnail: {
          url: message.guild.iconURL({ dynamic: true }),
        },
        fields: page,
        color: f.config.defColor,
      });

      embeds_pages.push(page_embed);
    }

    f.pages_menu(
      message,
      embeds_pages,
      180000,
      (reaction, user) => user.id === message.author.id
    );
  }

  #getOptions() {
    return {
      aliases: "role-incomes",
      description: "Просмотреть список ролей с заработком.",
      usage: "role-incomes",
      enabled: true,
      type: "Магазин",
      permissions: ["ADMINISTRATOR"],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: ["582260552588460053"],
    };
  }

  #getSlashOptions() {
    return {
      name: "role-incomes",
      description: this.options.description,
    };
  }
}
module.exports = Command;
