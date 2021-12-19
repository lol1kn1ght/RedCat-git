class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    var db = mongo.db(message.guild.id);
    var reactions = [`✅`, `❌`];

    await message.channel.send(`Вы начали процесс формирования сообщения.\n`);

    message.channel.send(
      `Создать новое сообщение (1) или взять за основу другое (2) ?`
    );
    var copy_embedResp = await getRespone();
    var copy_embed = copy_embedResp.first();
    if (!copy_embed || !copy_embed.content)
      return message.channel.send(`Выхожу с процесса создания сообщения.`);
    var copy = copy_embed.content;
    if (copy === `exit`)
      return message.channel.send(`Выхожу с процесса создания сообщения.`);
    switch (copy) {
      case `1`:
        var embed = new Discord.MessageEmbed();
        add();
        break;
      case `2`:
        message.channel.send(`Укажите канал нужного вам сообщения.`);
        var channel_msg = await getRespone();
        var channel_coll = channel_msg.first();
        if (!channel_coll)
          return message.channel.send(`Выхожу с процесса создания сообщения.`);
        if (!channel_coll.content)
          return message.channel.send(
            `Вы неправильно указали канал. Пропишите команду еще раз.`
          );
        var channel =
          channel_coll.mentions.channels.first() ||
          message.guild.channels.cache.get(channel_coll.content);
        if (!channel)
          return message.channel.send(`${f.na} Вы неправильно указали канал.`);
        message.channel.send(`Укажите айди сообщения.`);
        var msg = await getRespone();
        if (!msg.first())
          return message.channel.send(`Выхожу с процесса создания сообщения.`);
        var id = msg.first().content;
        if (!id)
          return message.channel.send(`${f.na} Вы не указали айди сообщения.`);
        var embedmsg_fetch = await channel.messages.fetch({
          around: id,
          limit: 1,
        });
        var embedmsg = embedmsg_fetch.first();
        if (!embedmsg)
          return message.channel.send(
            `${f.na} Мне не удалось найти нужное вам сообщение. Попробуйте еще раз.`
          );
        if (!embedmsg.embeds || !embedmsg.embeds[0])
          var embed = new Discord.MessageEmbed();
        else var embed = new Discord.MessageEmbed(embedmsg.embeds[0]);
        access(embed);
        break;
      default:
        return message.channel.send(
          `Вы неправильно указали ответ. Пропишите команду еще раз.`
        );
    }

    async function add() {
      message.channel.send(
        `Введите параметр, который вы бы хотели добавить в сообщение..`
      );
      var option = await getRespone();
      options(option.first().content);
    }

    async function options(option) {
      switch (option) {
        case "exit":
          return message.channel.send(`Выхожу с процесса создания сообщения.`);
          break;
        case "тайтл":
        case "заголовок":
        case "title":
          var resp = await getRespone(`Укажите заголовок для вашего сообщения`);
          var title = resp.first();
          if (!title)
            return message.channel.send(
              `Выхожу с процесса создания сообщения.`
            );
          if (title.content === `exit`)
            return message.channel.send(
              `Выхожу с процесса создания сообщения.`
            );
          if (title.content === `delete`) {
            if (embed.title) {
              delete embed.title;
              access(embed);
            }
            return;
          }
          embed.setTitle(title.content);
          access(embed);
          break;
        case "author":
        case "автор":
          message.channel.send(
            `Укажите что именно хотите изменить:\n1. Имя автора.\n2. Картинку автора`
          );
          var choice = await getRespone();
          if (!choice.first())
            return message.channel.send(
              `Выхожу с процесса создания сообщения.`
            );
          var answer = choice.first().content;
          if (answer === `exit`)
            return message.channel.send(
              `Выхожу с процесса создания сообщения.`
            );
          if (answer === `delete`) {
            if (embed.author) {
              delete embed.author;
              access(embed);
            }
            return;
          }
          switch (answer) {
            case `1`:
              var authorName = await getRespone(`Укажите автора.`);
              var name = authorName.first();
              if (!name || !name.content)
                return message.channel.send(
                  `Выхожу с процесса создания сообщения.`
                );
              name = name.content;
              if (name === `exit`)
                return message.channel.send(
                  `Выхожу с процесса создания сообщения.`
                );
              embed.setAuthor(name);
              access(embed);
              break;
            case `2`:
              if (!embed.author || !embed.author.name) {
                message.channel.send(
                  `${f.na} Вы должны сначала указать имя автора.`
                );
                options(option);
                return;
              }
              message.channel.send(
                `Прикрепите в вашем сообщении картинку для автора.`
              );
              var icon_url = await getRespone();
              var url = icon_url.first();
              if (!url)
                return message.channel.send(
                  `Выхожу с процесса создания сообщения.`
                );
              if (url.content === `exit`)
                return message.channel.send(
                  `Выхожу с процесса создания сообщения.`
                );
              url = url.attachments;
              if (!url) {
                message.channel.send(
                  `${f.na} Вы не прикрепили картинку для автора.`
                );
                options(option);
                return;
              }
              url = url.first();

              embed.setAuthor(embed.author.name, url.url);
              access(embed);
              break;
            default:
          }
          break;
        case "description":
        case "описание":
          var resp = await getRespone(`Введите описание вашего сообщения.`);
          var msg = resp.first();
          if (!msg)
            return message.channel.send(
              `Выхожу с процесса создания сообщения.`
            );
          var desc = msg.content;
          if (desc === `exit`)
            return message.channel.send(
              `Выхожу с процесса создания сообщения.`
            );
          if (desc === `delete`) {
            if (embed.description) {
              delete embed.description;
              access(embed);
            }
            return;
          }
          embed.setDescription(desc);
          access(embed);
          break;
        case "image":
        case "картинка":
          var resp = await getRespone(
            `Прикрепите файл картинки, которую вы хотели бы указать.`
          );
          var url = resp.first();
          if (!url)
            return message.channel.send(
              `Выхожу с процесса создания сообщения.`
            );
          if (url.content === `exit`)
            return message.channel.send(
              `Выхожу с процесса создания сообщения.`
            );
          if (url.content === `delete`) {
            if (embed.url) {
              delete embed.url;
              access(embed);
            }
            return;
          }
          url = url.attachments;
          if (!url) {
            message.channel.send(`${f.na} Вы не прикрепили картинку.`);
            options(option);
            return;
          }
          url = url.first();
          try {
            embed.setImage(url.url);
          } catch (e) {
            message.channel.send(`Вы прикрепили неправильный файл.`);
            options(option);
            return;
          }
          access(embed);
          break;
        case "footer":
        case "футер":
          message.channel.send(
            `Укажите что хотите изменить:\n1. Текст футера.\n2. Картинку Футера`
          );
          var answer = await getRespone();
          var ans = answer.first();
          if (!ans)
            return message.channel.send(
              `Выхожу с процесса создания сообщения.`
            );
          var value = ans.content;
          if (value === `delete`) {
            if (embed.footer) {
              delete embed.footer;
              access(embed);
            }
            return;
          }
          switch (value) {
            case "exit":
              return message.channel.send(
                `Выхожу с процесса создания сообщения.`
              );
              break;
            case `1`:
              message.channel.send(`Укажите текст для вашего футера.`);
              var footer = await getRespone();
              var footer_msg = footer.first();
              if (!footer_msg)
                return message.channel.send(
                  `Выхожу с процесса создания сообщения.`
                );
              var footer_text = footer_msg.content;
              embed.setFooter(footer_text);
              access(embed);
              break;
            case "2":
              if (!embed.footer || !embed.footer.text) {
                message.channel.send(
                  `${f.na} Что бы укзаать картинку нужно сначало указать текст футера.`
                );
                options(option);
                return;
              }
              var resp = await getRespone(
                `Прикрепите файл картинки, которую вы хотели бы указать.`
              );
              var url = resp.first();
              if (!url)
                return message.channel.send(
                  `Выхожу с процесса создания сообщения.`
                );
              if (url.content === `exit`)
                return message.channel.send(
                  `Выхожу с процесса создания сообщения.`
                );
              url = url.attachments;
              if (!url) {
                message.channel.send(`${f.na} Вы не прикрепили картинку.`);
                options(option);
                return;
              }
              url = url.first();
              try {
                embed.setFooter(embed.footer.text, url.url);
              } catch (e) {
                message.channel.send(`Вы прикрепили неправильный файл.`);
                options(option);
                return;
              }
              access(embed);
              break;
            default:
              message.channel.send(`${f.na} Вы указали неправильный ответ.`);
              options(option);
          }
          break;
        case "color":
        case "цвет":
          message.channel.send(`Укажите новый цвет для вашего сообщения.`);
          var color_msg = await getRespone();
          var color = color_msg.first();
          if (!color)
            return message.channel.send(
              `Выхожу с процесса создания сообщения.`
            );
          color = color.content;
          if (color === `exit`)
            return message.channel.send(
              `Выхожу с процесса создания сообщения.`
            );
          if (color === `delete`) {
            if (embed.color) {
              delete embed.color;
              access(embed);
            }
            return;
          }
          try {
            embed.setColor(color);
            access(embed);
          } catch (e) {
            message.channel.send(
              `${f.na} Вы неправильно указали цвет сообщения.`
            );
            options(option);
          }
          break;
        case "thumbnail":
          var resp = await getRespone(
            `Прикрепите файл картинки, которую вы хотели бы указать.`
          );
          var url = resp.first();
          if (!url)
            return message.channel.send(
              `Выхожу с процесса создания сообщения.`
            );
          if (url.content === `exit`)
            return message.channel.send(
              `Выхожу с процесса создания сообщения.`
            );
          if (url.content === `delete`) {
            if (embed.thumbnail) {
              delete embed.thumbnail;
            }
            return;
          }
          url = url.attachments;
          if (!url) {
            message.channel.send(`${f.na} Вы не прикрепили картинку.`);
            options(option);
            return;
          }
          url = url.first();
          try {
            embed.setThumbnail(url.url);
          } catch (e) {
            message.channel.send(`Вы прикрепили неправильный файл.`);
            options(option);
            return;
          }
          access(embed);
          break;
        default:
          message.channel.send(
            `Вы неправильно указали параметр для добавления.`
          );
          add();
      }
    }

    async function getRespone(text) {
      if (text) message.channel.send(text);
      var response = await message.channel.awaitMessages(
        (msg) => msg.author.id === message.author.id,
        {
          max: 1,
          time: f.parse_duration(`3m`),
        }
      );
      return response;
    }

    async function access(embed) {
      var result = await message.channel.send(`Результат:`, embed);
      for (let val of reactions) {
        await result.react(val);
      }
      var reacts = await result.awaitReactions(
        (r, u) =>
          reactions.includes(r.emoji.name) && u.id === message.author.id,
        {
          max: 1,
          time: f.parse_duration(`3m`),
        }
      );
      if (!reacts.first())
        return message.channel.send(`Выхожу с процесса создания сообщения.`);
      switch (reacts.first().emoji.name) {
        case reactions[0]:
          message.channel.send(
            `Отправить новое сообщение (1) или отредактировать другое (2) ?`
          );
          var copy_embedResp = await getRespone();
          var copy_embed = copy_embedResp.first();
          if (!copy_embed || !copy_embed.content)
            return message.channel.send(
              `Выхожу с процесса создания сообщения.`
            );
          var copy = copy_embed.content;
          if (copy === `exit`)
            return message.channel.send(
              `Выхожу с процесса создания сообщения.`
            );
          switch (copy) {
            case `1`:
              var channelMsg = await getRespone(
                `Укажите канал куда отправить данное сообщение (\`-1 если в этот канал.\`).`
              );
              channelMsg = channelMsg.first();
              if (!channelMsg)
                return message.channel.send(
                  `Выхожу с процесса создания сообщения.`
                );
              if (channelMsg.content === `exit`)
                return message.channel.send(
                  `Выхожу с процесса создания сообщения.`
                );
              var channel =
                channelMsg.mentions.channels.first() ||
                message.guild.channels.cache.get(channelMsg.content);
              if (channelMsg.content === `-1`) channel = message.channel;
              if (!channel) {
                message.channel.send(
                  `Вы неправильно указали канал. Пройдите проверку еще раз.`
                );
                access(embed);
                return;
              }
              channel.send(embed);
              message.channel.send(reactions[0]);
              break;
            case `2`:
              message.channel.send(`Укажите канал нужного вам сообщения.`);
              var channel_msg = await getRespone();
              var channel_coll = channel_msg.first();
              if (!channel_coll)
                return message.channel.send(
                  `Выхожу с процесса создания сообщения.`
                );
              if (!channel_coll.content)
                return message.channel.send(
                  `Вы неправильно указали канал. Пропишите команду еще раз.`
                );
              var channel =
                channel_coll.mentions.channels.first() ||
                message.guild.channels.cache.get(channel_coll.content);
              if (!channel)
                return message.channel.send(
                  `${f.na} Вы неправильно указали канал.`
                );
              message.channel.send(`Укажите айди сообщения.`);
              var msg = await getRespone();
              if (!msg.first())
                return message.channel.send(
                  `Выхожу с процесса создания сообщения.`
                );
              var id = msg.first().content;
              if (!id)
                return message.channel.send(
                  `${f.na} Вы не указали айди сообщения.`
                );
              var embedmsg_fetch = await channel.messages.fetch({
                around: id,
                limit: 1,
              });
              var embedmsg = embedmsg_fetch.first();
              if (!embedmsg)
                return message.channel.send(
                  `${f.na} Мне не удалось найти нужное вам сообщение. Попробуйте еще раз.`
                );
              try {
                embedmsg.edit(embed);
                message.channel.send(reactions[0]);
              } catch (e) {
                message.channel.send(
                  `Произошла ошибка! Возможно вы указали айди сообщения, которое бот не смог отредактировать. Убедитесь, что нужное сообщение отправлено ботом`
                );
                access(embed);
                return;
              }
              break;
            default:
              return message.channel.send(
                `Вы неправильно указали ответ. Пропишите команду еще раз.`
              );
          }

          break;
        case reactions[1]:
          add();
          break;
      }
    }
  }

  #getOptions() {
    return {
      aliases: "send",
      description: "начать формирования ебмеда {ADMIN | MODER}",
      enabled: true,
      type: "Администрация",
      permissions: ["ADMINISTRATOR"],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: [
        "582260552588460053",
        "652455460632395776",
        "691236866443182126",
      ],
    };
  }

  #getSlashOptions() {
    return {
      name: "send",
      description: this.options.description,
    };
  }
}
module.exports = Command;
