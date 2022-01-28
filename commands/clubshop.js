const f = require("../config/modules");
const pagesMenu = require("../functions/pagesMenu");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);
    let sort_opts = args[0] || `id_1`;
    let sort_value;
    switch (sort_opts) {
      case "cost":
      case "цена":
      case "стоимость":
        sort_value = {
          cost: -1,
        };
        break;
      case "id":
      case "айди":
        sort_value = {
          id: -1,
        };
        break;

      default:
        let opts = sort_opts.split(`_`);
        sort_value = {
          [opts[0]]: Number(opts[1]),
        };
    }

    let items_db = db.collection("clubs_shop");
    let items_data = await items_db.find().sort({ cost: 1 }).toArray();;
    if (!items_data[0]) return f.msgFalse(message, "Клубный магазин пуст.");
    let pages = [];
    let curr_page = 0;
    let count = 1;
    let embeds_pages = [];
    let item_pos = 1;

    for (let item of items_data) {
      let item_field = {
        name: `${item_pos++}. ${item.name} - **${f.discharge(item.cost)}**${
          f.currency
        }`,
        value: item.description || "Пусто.",
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
        title: "Клубный магазин:",
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
      aliases: "club-shop clubshop",
      description: "посмотреть каталог товаров в магазине клубов",
      usage: "clubshop",
      enabled: true,
      type: "Магазин Клубов",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "club-shop",
      description: this.options.description,
      options: [
        {
          name: "sort",
          description: "опции для сортировки предметов",
          required: false,
          type: 3,
          choices: [
            {
              name: "по стоимости от большего к меньшему",
              value: "cost_-1",
            },
            {
              name: "по стоимости от меньшего к большему",
              value: "cost_1",
            },
          ],
        },
      ],
    };
  }
}
module.exports = Command;
