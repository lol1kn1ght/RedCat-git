module.exports = async function(message, pages, time, filter, start_page) {
  if (!message || !pages || !pages[0])
    throw new Error("Осутствуют обязательные аргументы.");
  if (!filter) filter = () => true;
  if (!time) time = 60000;

  let prev_page = new Discord.MessageButton({
    type: "BUTTON",
    label: "Назад",
    customId: "prev_page",
    style: "PRIMARY",
    disabled: true
  });

  let next_page = new Discord.MessageButton({
    type: "BUTTON",
    label: "Вперед",
    customId: "next_page",
    style: "PRIMARY",
    disabled: false
  });

  let buttons_row = new Discord.MessageActionRow().addComponents(
    prev_page,
    next_page
  );

  let menu_msg = await message.channel.send({
    embeds: [pages[start_page - 1] || pages[0]],
    components: pages.length > 1 ? [buttons_row] : undefined
  });
  if (!pages[1]) return;

  let user_page = start_page || 1;
  let page_emojis = f.config.menuEmojis; // Эмоджи для листания страниц
  let menu_page = user_page - 1; // Текущая страница при листании меню

  let pages_collector = menu_msg.createMessageComponentCollector({
    filter: interaction =>
      filter(interaction) &&
      ["next_page", "prev_page"].includes(interaction.customId),
    time: time
  }); // Создание коллектора реакций для листания страниц

  pages_collector.on("collect", interaction => {
    if (!interaction.isButton()) return;

    let button = interaction;

    switch (button.customId) {
      case "prev_page":
        // Листнуть страницу назад
        if (menu_page - 1 < 0) return;
        --menu_page;

        if (menu_page - 1 < 0) prev_page.disabled = true;
        
       let new_row_1 = new Discord.MessageActionRow().addComponents(
          prev_page,
          next_page
        );
        button.update({embeds: [pages[menu_page]], components: [new_row_1]});
        break;

      case "next_page":
        // Листнуть страницу вперед
        if (menu_page + 1 > pages.length - 1) return;
        ++menu_page;
        
        if (menu_page + 1 > pages.length - 1) next_page.disabled = true;

         let new_row_2 = new Discord.MessageActionRow().addComponents(
          prev_page,
          next_page
        );
        button.update({embeds: [pages[menu_page]], components: [new_row_2]});
        break;
    }
  });

  pages_collector.on("end", () => menu_msg.edit({components: []})); // Удаление всех реакций с сообщения при закрытии коллектора реакций
};
