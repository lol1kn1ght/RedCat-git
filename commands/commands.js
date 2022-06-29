const { type } = require("os");
const f = require("../config/modules");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    const { promisify } = require("util");
    const fs = require("fs");
    const readdir = promisify(fs.readdir);

    let categories = new Discord.Collection(); // Объект с коммандами, разбитыми на категории
    let commands_names = await readdir(__dirname); // Получаем названия всех файлов внутри папки commands
    let commands = commands_names.map((command_name) => {
      if (!command_name.includes(".js")) return;
      return require(__dirname + "/" + command_name);
    }); // Достаем из каждого файла экспортируемый класс команды и пушим его в новый массив

    for (let Command_class of commands) {
      if (!Command_class) continue;

      let command = new Command_class(); // Вызываем класс команды
      let options = command.options; // Достаем из команды опции
      let type = options.type; // Из опций достаем тип команды

      if (type.includes("--hidden")) continue; // Скрыть команду если присутствует тег --hidden

      let curr_category = categories.get(type) || [];

      if (type === "WIP" || !f.config.allowed_types.includes(type)) continue;

      curr_category.push({
        name: `Команда: ${
          options.usage ? options.usage : options.aliases.split(" ").join(", ")
        }`,
        value: options.description,
        type: options.type,
      });

      categories.set(type, curr_category);
    }

    let embeds = [];
    let page = 1;

    categories.each(async (category) => {
      let current_num = 1;
      let fields = [];
      let current_category = "";
      let current_page = 0;

      for (let command of category) {
        current_category = command.type;

        if (fields[current_page]) fields[current_page].push(command);
        else fields[current_page] = [command];

        current_num++;

        if (current_num > 5) {
          current_num = 0;
          current_page++;
        }
      }

      for (let field of fields) {
        let category_embed = new Discord.MessageEmbed({
          title: `Категория "${current_category}":`,
          fields: field,
          color: f.config.defColor,
        });

        embeds.push(category_embed);
      }
    });

    f.pages_menu(
      message,
      embeds,
      180000
    );
  }

  #getOptions() {
    return {
      aliases: "commands",
      description: "Вывод комманд бота и разделение по категориям",
      enabled: true,
      type: "Статистика",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "commands",
      description: this.options.description,
    };
  }
}
module.exports = Command;
