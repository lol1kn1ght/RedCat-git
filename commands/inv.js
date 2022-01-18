const {pages_menu} = require("../config/modules");
const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);

    let member =
      message.guild.members.cache.get(args[0]) ||
      message.mentions.members.first() ||
      message.member;

    let users_db = db.collection("users");
    let user_data = await users_db.find({login: member.id}).toArray();
    let items_db = db.collection("shop");
    let items_data = await items_db.find().toArray();

    let user = user_data[0];
    if (!user || !user.inventory || !user.inventory[0])
      return f.msgFalse(message, `Инвентарь ${member} пуст.`);
    let inventory = user.inventory;
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
        title: `Инвентарь ${member.user.tag}:`,
        fields: page,
        description: `Пропишите \`${f.prefix}use (название предмета)\` для его использования.`,
        footer: {
          text: `Страница ${pages_count++} из ${pages.length}`
        },
        color: f.config.defColor,
        thumbnail: {
          url: message.author.displayAvatarURL({dynamic: true})
        }
      });

      embeds.push(page_embed);
    }

    if (!embeds[0]) return f.msgFalse(message, "Ваш инвентарь пуст!");

    f.pages_menu(
      message,
      embeds,
      18000,
      (reaction, user) => user.id === message.author.id
    );
  }

  #getOptions() {
    return {
      aliases: "inv inventory",
      description: "проверить ваш инвентарь",
      usage: "inv (упоминание участника)",
      enabled: true,
      type: "Магазин",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "inventory",
      description: this.options.description
    };
  }
}
module.exports = Command;
