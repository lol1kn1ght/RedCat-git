class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);

    let item_cost = Number(args[args.length - 1]); // Перевод стоимости предмета из строки в число
    args.splice(args.length - 1, 1); // Из массива аргументов вырезаем цену
    let item_name = args.join(" "); // Новый массив без цены склеиваем в одну строку через пробел

    if (!item_name)
      return f.msgFalse(
        message,
        `Вы не указали название для нового предмета.\nИспользование: \`${this.options.usage}\``
      );

    if (isNaN(item_cost))
      return f.msgFalse(message, "Вы не указали цену предмета.");
    if (item_cost < 0)
      return f.msgFalse(
        message,
        `Цена предмета не может быть меньше 0${f.currency}.`
      );

    let shop_db = db.collection("clubs_shop");
    let shop = await shop_db.find().toArray(); // Запрос в базу данных айтемов магазина
    let shop_ids = shop.map((item) => item.id); // Выцепляем из всех предметов только айди и создаем новый массив только с айдишниками всех предметов
    let new_item_id = 1; // Задаем начальное значение для айди нвого предмета

    let same_items = shop.filter(
      (item) => item.name.toLowerCase() === item_name.toLowerCase()
    )[0];
    if (same_items)
      return f.msgFalse(message, "Предмет с таким названием уже существует.");

    let settings_db = db.collection("settings");
    let settings_data = await settings_db
      .find({ guildID: message.guild.id })
      .toArray(); // Запрашиваем настройки сервера
    let settings = settings_data[0] || {}; // Вытаскиваем из массива сами настройки
    let last_ids = settings.club_items_ids || []; // Достаем из настроек массив с исторей айди предметов

    while (shop_ids.includes(new_item_id) || last_ids.includes(new_item_id)) {
      // Вызываем пока есть совпадения по айди в массиве айдишников предметов, которые когда-либо существовали или существуют
      new_item_id++; // Если есть совпадения в массиве, то увеличиваем айди пока совпадений найдено не будет
    }

    let new_item = {
      // Создаем объект нового предмета
      name: item_name,
      cost: item_cost,
      id: new_item_id,
    };

    last_ids.push(new_item.id);
    if (settings_data[0]) {
      settings_db.updateOne(
        {
          guildID: message.guild.id,
        },
        {
          $set: {
            club_items_ids: last_ids,
          },
        }
      );
    } else {
      settings_db.insertOne({
        guildID: message.guild.id,
        club_items_ids: last_ids,
      });
    }

    shop_db.insertOne(new_item); // Добавляем в базу данных новый предмет
    f.msg(
      message,
      `Вы успешно создали предмет **${item_name}** \nи установили ему цену в **${f.discharge(
        item_cost
      )}${f.currency}**`
    );
  }

  #getOptions() {
    return {
      aliases: "cs-create club-shop-create",
      description: "Создать товар в магазине клубов.",
      usage: "cs-create [название предмета] [цена]",
      enabled: true,
      type: "Магазин Клубов",
      permissions: ["ADMINISTRATOR"],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [],
    };
  }

  #getSlashOptions() {
    return {
      name: "club-shop-create",
      description: this.options.description,
    };
  }
}
module.exports = Command;
