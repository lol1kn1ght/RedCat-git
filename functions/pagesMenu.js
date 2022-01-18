module.exports = async function(message, pages, time, filter, start_page) {
  if (!message || !pages || !pages[0])
    throw new Error("Осутствуют обязательные аргументы.");
  if (!filter) filter = () => true;
  if (!time) time = 60000;

  let menu_msg = await message.channel.send({
    embeds: [pages[start_page - 1] || pages[0]]
  });
  if (!pages[1]) return;

  let user_page = start_page || 1;
  let page_emojis = f.config.menuEmojis; // Эмоджи для листания страниц
  let menu_page = user_page - 1; // Текущая страница при листании меню

  let pages_collector = menu_msg.createReactionCollector({
    filter: (reaction, user) =>
      filter(reaction, user) && page_emojis.includes(reaction.emoji.name),
    time: time
  }); // Создание коллектора реакций для листания страниц

  let set_reactions = async () => {
    for (let menu_emoji of page_emojis) await menu_msg.react(menu_emoji);
  };
  if (pages.length > 1) set_reactions(); // Установить реакции листания страниц на сообщение с топом

  pages_collector.on("collect", (reaction, user) => {
    reaction.users.remove(user.id);

    switch (reaction.emoji.name) {
      case page_emojis[0]:
        // Листнуть страницу назад
        if (menu_page - 1 < 0) return;
        menu_msg.edit({embeds: [pages[--menu_page]]});
        break;

      case page_emojis[1]:
        // Листнуть страницу вперед
        if (menu_page + 1 > pages.length - 1) return;
        menu_msg.edit({embeds: [pages[++menu_page]]});
        break;
    }
  });

  pages_collector.on("end", () => menu_msg.reactions.removeAll()); // Удаление всех реакций с сообщения при закрытии коллектора реакций
};
