class Event {
  constructor() {}

  async execute(bot, mongo, interaction) {
    if (!interaction.isButton()) return;

    if (interaction.channel.id != "652521261058228236") return;

    let role = interaction.guild.roles.cache.get(interaction.customId);

    let interaction_member = interaction.member;

    // Выдача доступа на верификацию
    if (interaction.customId === "798422475905040445") {
      if (
        !interaction_member.roles.cache.has("598164183586177064") ||
        interaction_member.roles.cache.has("808733824774832158")
      ) {
        interaction.reply({
          content: `Верификация доступна только для игроков с PS, не получавших отказ ранее`,
          ephemeral: true
        });
        return;
      } else {
        if (interaction_member.roles.cache.has(role.id)) {
          interaction.reply({
            content: `Доступ к чату для верификации приостановлен`,
            ephemeral: true
          });

          return interaction_member.roles.remove(role.id);
        }

        interaction.reply({
          content: `Выдан доступ к чату для верификации. Проверьте личные сообщения - дополнительная информация направлена туда!`,
          ephemeral: true
        });

        return interaction_member.roles.add(role.id);
      }
    }

    // Выбор платформы
    // 626800044884099082 - PC
    // 598163957081178126 - XBOX
    // 598164183586177064 - PS
    if (
      interaction.customId === "626800044884099082" ||
      interaction.customId === "598163957081178126" ||
      interaction.customId === "598164183586177064"
    ) {
      if (interaction_member.roles.cache.has("689152734469161015")) {
        interaction.reply({
          content: `Выбор платформы недоступен для подозреваемых в нечестной игре!`,
          ephemeral: true
        });
        return;
      } else {
        if (interaction_member.roles.cache.has(role.id)) {
          // Забираем доступ к поиску по другим играм, а в случае PS - ещё и к верификации
          if (
            role.id === "626800044884099082" &&
            interaction_member.roles.cache.has("933946149147136041")
          )
            interaction_member.roles.remove("933946149147136041");

          if (
            role.id === "598163957081178126" &&
            interaction_member.roles.cache.has("933928627450568725")
          )
            interaction_member.roles.remove("933928627450568725");

          if (role.id === "598164183586177064") {
            if (interaction_member.roles.cache.has("933928456566210620"))
              interaction_member.roles.remove("933928456566210620");

            if (interaction_member.roles.cache.has("798422475905040445"))
              interaction_member.roles.remove("798422475905040445");
          }

          interaction.reply({
            content: `Снята роль платформы ${role}`,
            ephemeral: true
          });

          return interaction_member.roles.remove(role.id);
        }

        interaction.reply({
          content: `Выдана роль платформы ${role}`,
          ephemeral: true
        });

        return interaction_member.roles.add(role.id);
      }
    }

    // Обработка кнопки "другие игры"
    // 933946149147136041 - Другие игры ПК
    // 933928627450568725 - Другие игры XBOX
    // 933928456566210620 - Другие игры PS
    if (interaction.customId === "00000000000000001") {
      if (
        interaction_member.roles.cache.has("933946149147136041") ||
        interaction_member.roles.cache.has("933928627450568725") ||
        interaction_member.roles.cache.has("933928456566210620")
      ) {
        if (interaction_member.roles.cache.has("933946149147136041"))
          interaction_member.roles.remove("933946149147136041");

        if (interaction_member.roles.cache.has("933928627450568725"))
          interaction_member.roles.remove("933928627450568725");

        if (interaction_member.roles.cache.has("933928456566210620"))
          interaction_member.roles.remove("933928456566210620");

        interaction.reply({
          content: `Ограничен доступ к поиску игроков по другим играм на имеющихся платформах`,
          ephemeral: true
        });

        return;
      } else {
        if (
          interaction_member.roles.cache.has("626800044884099082") ||
          interaction_member.roles.cache.has("598163957081178126") ||
          interaction_member.roles.cache.has("598164183586177064")
        ) {
          if (interaction_member.roles.cache.has("626800044884099082"))
            interaction_member.roles.add("933946149147136041");

          if (interaction_member.roles.cache.has("598163957081178126"))
            interaction_member.roles.add("933928627450568725");

          if (interaction_member.roles.cache.has("598164183586177064"))
            interaction_member.roles.add("933928456566210620");

          interaction.reply({
            content: `Выдан доступ к поиску игроков по другим играм на имеющихся платформах`,
            ephemeral: true
          });
          return;
        } else {
          interaction.reply({
            content: `Сначала выберите платформу в сообщении ниже!`,
            ephemeral: true
          });
          return;
        }
      }
    }

    // Выдача роли "поиск игроков"
    if (interaction.customId === "724513678149550161") {
      if (interaction_member.roles.cache.has(role.id)) {
        interaction.reply({
          content: `Снята роль ${role}`,
          ephemeral: true
        });

        return interaction_member.roles.remove(role.id);
      } else {
        if (
          interaction_member.roles.cache.has("626800044884099082") ||
          interaction_member.roles.cache.has("598163957081178126") ||
          interaction_member.roles.cache.has("598164183586177064")
        ) {
          interaction.reply({
            content: `Выдана роль ${role}`,
            ephemeral: true
          });

          return interaction_member.roles.add(role.id);
        } else {
          interaction.reply({
            content: `Сначала выберите платформу в сообщении ниже!`,
            ephemeral: true
          });
          return;
        }
      }
    }
  }
}
module.exports = (...args) => {
  new Event().execute(...args);
};
