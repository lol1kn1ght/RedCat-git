class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);
    let clubs_db = db.collection("clubs");
    let clubs_data = await clubs_db.find().toArray();
    this.clubs_db = clubs_db;

    let club = clubs_data.filter(
      club =>
        club.owner === message.author.id ||
        (club.admins || []).includes(message.author.id)
    )[0];
    if (!club)
      return f.msgFalse(
        message,
        "Вы не являетесь админом или овнером ни одного из клубов."
      );

    let option = args[0];
    if (!option)
      return f.msgFalse(message, `Вы не указали что хотите сделать.`);

    switch (option) {
      case "name":
      case "название":
        if (message.author.id !== club.owner)
          return f.msgFalse(
            message,
            "Только владелец клуба может изменять данный параметр."
          );

        message.channel.send("Укажите новое имя вашего клуба:");
        let name_message = await this.awaitMessages(message, 180000);
        let new_name = name_message.first().content;

        if (new_name.length > 20)
          return f.msgFalse(
            message,
            "Длина названия клуба не должна превышать 20 символов."
          );

        club.name = new_name;
        this.updateData(club);
        f.msg(message, "Вы успешно изменили название своего клуба.");
        break;
      case "description":
      case "desc":
      case "описание":
        message.channel.send("Укажите новое описание клуба:");

        let desc_message = await this.awaitMessages(message, 180000);
        let new_desc = desc_message.first().content;

        if (new_desc.length > 100)
          return f.msgFalse(
            message,
            "Длина нового описания не должна превышать 100 символов."
          );

        club.description = new_desc;
        this.updateData(club);
        f.msg(message, "Вы успешно установили новое описание клуба.");
        break;
      case "image":
      case "картинка":
      case "изображение":
        let image_regex = /(https?:\/\/)?[\w\-~]+(\.[\w\-~]+)+(\/[\w\-~@:%]*)*(#[\w\-]*)?(\?[^\s]*)?/gi;
        message.channel.send("Укажите новое изображение вашего клуба:");

        let await_message = await this.awaitMessages(message, 180000);
        let image_message = await_message.first();
        let new_image =
          (image_regex.test(image_message.content) && image_message.content) ||
          (image_message.attachments.first() || {}).url;

        if (!new_image)
          return f.msgFalse(
            message,
            "Вы не указали ссылку на нужную вам картинку либо же не прикрепили ее."
          );

        club.image = new_image;
        this.updateData(club);
        f.msg(message, "Вы успешно установили новую иконку клуба.");
        break;

      case "admin":
      case "админ":
        if (message.author.id !== club.owner)
          return f.msgFalse(
            message,
            "Только владелец клуба может изменять данный параметр."
          );
        message.channel.send(
          "Укажите какого участника добавить / удалить из админов клуба:"
        );

        let await_admin = await this.awaitMessages(message, 180000);
        let admin_message = await_admin.first();
        let new_admin =
          admin_message.mentions.members.first() ||
          message.guild.members.cache.get(admin_message.content);

        if (!new_admin)
          return f.msgFalse(message, "Вы указали несуществующего участника.");
        if (!club.members.includes(new_admin.id))
          return f.msgFalse(
            message,
            "Данный человек не находится в вашем клубе."
          );

        if (!club.admins) club.admins = [];

        if (club.admins.includes(new_admin.id)) {
          club.admins.splice(club.admins.indexOf(new_admin.id), 1);

          this.updateData(club);
          f.msg(
            message,
            `Вы сняли админа своего клуба с участника **${new_admin.user.tag}**`
          );
          return;
        }
        if (!club.admins.includes(new_admin.id)) {
          club.admins.push(new_admin.id);

          this.updateData(club);
          f.msg(
            message,
            `Вы успешно выдали админа своего клуба участнику **${new_admin.user.tag}**`
          );
          return;
        }

        break;
      default:
        f.msgFalse(
          message,
          "Вы неправильно указали опцию для редактирования.\nДоступные опции: `название, описание, картинка, админ`"
        );
    }
  }

  async awaitMessages(message, time) {
    let message_await = await message.channel
      .awaitMessages(msg => msg.author.id === message.author.id, {
        time: time,
        max: 1,
        errors: ["time"]
      })
      .catch(e => {
        return f.msgFalse(message, "Время ожидания истекло.");
      });
    return message_await;
  }

  async updateData(data) {
    this.clubs_db.updateOne(
      {
        owner: data.owner
      },
      {
        $set: data
      }
    );
  }

  #getOptions() {
    return {
      aliases: "clubedit club-edit",
      description: "изменить параметры вашего клуба",
      enabled: true,
      type: "Клубы",
      permissions: [],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "club-edit",
      description: this.options.description
    };
  }
}
module.exports = Command;
