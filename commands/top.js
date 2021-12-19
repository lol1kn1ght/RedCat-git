const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);
    let user_page = isNaN(Number(args[0])) ? 1 : Number(args[0]); // Страница топа, заданная самим участником (с этой страницы начинается вывод топа)
    let users_DB = db.collection("users");
    let users_data = await users_DB
      .find()
      .sort({
        coins: -1,
      })
      .toArray(); // Получение записей юзеров и сортировка в порядке уменьшения по полю coins

    let users = users_data.filter((val) =>
      message.guild.members.cache.get(val.login)
    ); // Отсеивание ливнувших с сервера, но оставшихся в бд участников

    let embeds_pages = []; // Массив с страницами-ембедами
    let pages = []; // Массив со строками-страницами внутри ембеда
    let curr_page = 0; // Текущая страница в итерации участников из бд
    let iter_num = 1; // Текущее в итерации место участника на странице
    let user_pos = 1; // Позиция участника в топе
    let author_pos = false; // Позиция автора сообщения в топе (Если его нету в топе, то false)
    let embed_page = 1; // Текущая страница, показывающаяся при листании ембедов

    for (let user of users) {
      let member = message.guild.members.cache.get(user.login);
      if (user.login === message.author.id) author_pos = user_pos;

      let user_field = `**${user_pos++}**. ${member.user.tag} - **${f.discharge(
        user.coins
      )}${f.currency}**\n`;

      if (pages[curr_page]) pages[curr_page] += user_field;
      else pages[curr_page] = user_field;

      iter_num++;

      if (iter_num > 10) {
        ++curr_page;
        iter_num = 0;
      } // Если больше 10-ти записей на одной странице, то создается новая страница
    }

    for (let page of pages) {
      let page_embed = new Discord.MessageEmbed()
        .setAuthor(
          "Доска лидеров по валюте:",
          message.guild.iconURL({ dynamic: true })
        )
        .setDescription(page)
        .setColor(f.config.defColor)
        .setFooter(
          `Страница ${embed_page++} из ${pages.length} - Ваша позиция ${
            author_pos || "Нету :с"
          }`
        );
      embeds_pages.push(page_embed);
    }

    if (!embeds_pages[0]) {
      let page_embed = new Discord.MessageEmbed()
        .setAuthor(
          "Доска лидеров по валюте:",
          message.guild.iconURL({ dynamic: true })
        )
        .setDescription("Пусто :с")
        .setColor(f.config.defColor)
        .setFooter(
          `Страница ${embed_page++} из ${pages.length || 1} - Ваша позиция: ${
            author_pos || "Нету :с"
          }`
        );
      embeds_pages.push(page_embed);
    }

    if (user_page > pages.length || user_page < pages.length) user_page = 1; // Проверка если указана недействительная страница, то ставится первая страница

    f.pages_menu(
      message,
      embeds_pages,
      180000,
      (r, u) => u.id === message.author.id,
      user_page
    );
  }

  #getOptions() {
    return {
      aliases: "top",
      description: "вывести топ участников по валюте",
      usage: "top",
      enabled: true,
      type: "Экономика",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "top",
      description: this.options.description,
      options: [
        { name: "page", description: "страница", type: 4, required: false },
      ],
    };
  }
}
module.exports = Command;
