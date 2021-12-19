const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const util = require("util");
const Slash_client = require("discord-slash-commands-client").Client;
const mongo_config = require("./config/mongo.json");
const token = require("./config/token.json").token;

let f = require(`./config/modules.js`);

const {MongoClient} = require("mongodb");
const slash = new Slash_client(token, "813346729977315328");

let green = "\x1b[32m";
let red = "\x1b[31m";
let magenta = "\x1b[35m";
let white = "\x1b[0m";
let cyan = "\x1b[36m";

class BotLaunch {
  constructor() {
    this.config = require("./config/config.json");
    this.readdir = util.promisify(fs.readdir);
    this.mongoClient = MongoClient;
    this.bot = client;
    this.commands = {};
    this.#launch();
  }

  async #launch() {
    console.log(
      `${green} ---------------------------| Запуск бота |---------------------------\n`,
      white
    );
    console.log(
      `${magenta} Авторизация бд:`,
      `${mongo_config.auth ? `${green}Включена` : `${red}Выключена`};`
    );
    console.log(
      `${magenta} Слэш-команды: ` +
        (this.config.slash_commands ? `${green}Включены` : `${red}Выключены`) +
        `;\n`
    );
    console.log(`${green} --------------------|`);
    console.time("Время запуска бота");
    await this.authDB();
    console.log(`${green} --------------------|`);
    await this.reLoadEvents();
    console.log(`${green} --------------------|`);
    await this.reloadCommands();
    console.log(`${green} --------------------|`);

    await this.login();

    // if (f.config.slash_commands) {
    //   console.log(`${green} --------------------|`);
    //   await this.loadSlashCommands(this.commands);
    // }
    // if (!f.config.slash_commands) {
    //   console.log(`${green} --------------------|`);
    //   await this.clearSlashCommands();
    // }
    console.timeEnd(`Время запуска бота`);
    console.log(
      `${green} \n ---------------------------------------------------------------------`
    );
  }
  async authDB() {
    let {user, ip, pass, auth} = mongo_config;

    if (!auth) ip = "localhost";

    let connect = util.promisify(this.mongoClient.connect);

    let mongo = await connect(
      `mongodb+srv://${user}:${pass}@${ip}`,
      // `mongodb://${auth ? `${user}:${pass}@${ip}` : ip}:27017`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    this.mongo = mongo;
    console.log(`${cyan} Успешно подключена база данных ${ip}:${27017}`);
  }

  async reloadCommands() {
    console.log(
      `${green} ############### | Начинаю загрузку серверных команд | ###############\n`,
      white
    );
    let dir = await this.readdir("./commands");

    for (let file of dir) {
      if (!file.includes(".js")) continue;
      let filename = file.replace(".js", "");

      try {
        let cache = require.cache[require.resolve(`./commands/${filename}`)];
        if (cache)
          delete require.cache[require.resolve(`./commands/${filename}`)];

        let cmd = new (require(`./commands/${filename}`))();
        this.commands[cmd.options.aliases] = cmd;
        // console.log(cmd);
        console.log(`${cyan} Успешно загружена серверная команда ${filename}`);
      } catch (e) {
        console.log(`${red} Ошибка в ${filename}: ${e}`);
      }
    }
    console.log(
      `\n${green} ############### | Закончил загрузку серверных команд | ##############\n`
    );
  }

  async reLoadEvents() {
    console.log(
      `${green} ################### | Начинаю загрузку ивентов | ####################\n`,
      white
    );
    let dir = await this.readdir("./events");
    let bot = this.bot;
    bot._events = {};
    for (let file of dir) {
      if (!file.includes(".js")) continue;
      let filename = file.replace(`.js`, ``);
      let eventname = filename.split(" ")[0];

      let cache = require.cache[require.resolve(`./events/${filename}`)];
      if (cache) delete require.cache[require.resolve(`./events/${filename}`)];

      try {
        let executefunc = require(`./events/${filename}.js`);
        bot.on(eventname, executefunc.bind(null, bot, this.mongo));
        console.log(`${cyan} Успешно загружен ивент ${filename}`);
      } catch (e) {
        console.log(`${red} Ошибка в ${filename}:`);
        console.log(e);
      }
    }
    console.log(
      `\n${green} ################### | Закончил загрузку ивентов | ####################\n`,
      white
    );
  }

  async loadDMCommands() {}

  async clearSlashCommands() {
    let guildID = f.config.slash_guild;
    console.log(
      `\n${green} ################### | Начинаю очистку прошлых слеш-команд | ####################\n`
    );
    let before_commands = await slash.getCommands({
      guildID: guildID
    });
    await delete_slash();
    async function delete_slash() {
      let current_command = 0;
      let slash_commands = await slash.getCommands({
        guildID: guildID
      });
      if (!slash_commands[0])
        return console.log(
          `Успешно удалено ${before_commands.length} слеш-команд`
        );

      let slash_command = slash_commands[current_command++];
      if (!slash_command) return;

      await slash
        .deleteCommand(slash_command.id, f.config.slash_guild)
        .catch(e => {});
      await delete_slash();
    }
    console.log(
      `\n${green} ################### | Закончил очистку прошлых слеш-команд | ####################\n`
    );
  }

  async loadSlashCommands(list_commands) {
    await this.clearSlashCommands();
    console.log(
      `\n${green} ################### | Начинаю загрузку новых слеш-команд | ####################\n`
    );
    for (let command_name in list_commands) {
      let command = list_commands[command_name];
      let options_arr = command.options.type.split(" ");

      if (
        command.options.permissions.includes("OWNER") ||
        options_arr.includes("WIP") ||
        options_arr.includes("--hidden")
      )
        continue;

      if (!f.config.allowed_types.includes(command.options.type)) continue;

      await this.bot.api
        .applications(this.bot.user.id)
        .guilds(f.config.slash_guild)
        .commands.post({
          data: command.slashOptions
        });
      console.log(
        `Успешно загружена слеш-команда ${command.slashOptions.name}`
      );
    }
    console.log(
      `\n${green} ################### | Закончил загрузку новых слеш-команд | ####################\n`
    );
  }

  async login() {
    await this.bot.login(token);
    console.log(`${cyan} ${this.bot.user.tag} Успешно запущен.\n`);
  }
}

let bot = new BotLaunch();
global.Bot = bot;
global.f = f;
global.Profile = require(`./functions/getProfile.js`).bind(null, Bot.bot);
global.Club = require(`./functions/getClub.js`);
global.Discord = Discord;
