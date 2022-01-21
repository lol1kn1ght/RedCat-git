class Event {
  constructor() {}

  async execute(bot, mongo, interaction) {
    if (!interaction.isButton()) return;

    if (interaction.channel.id != "652521261058228236") return;

    let role = interaction.guild.roles.cache.get(interaction.customId);

    if (!role) return;

    let interaction_member = interaction.member;

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
      }
    }

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
      }
    }

    if (interaction_member.roles.cache.has(role.id)) {
      interaction.reply({
        content: `Снял вам роль ${role}`,
        ephemeral: true
      });

      return interaction_member.roles.remove(role.id);
    }

    interaction.reply({
      content: `Выдал вам роль ${role}`,
      ephemeral: true
    });

    interaction_member.roles.add(role.id);
  }
}
module.exports = (...args) => {
  new Event().execute(...args);
};
