class Event {
  constructor() {}

  async execute(bot, mongo, interaction) {
    if (!interaction.isButton()) return;

    if (interaction.channel.id != "652521261058228236") return;

    let role = interaction.guild.roles.cache.get(interaction.customId);

    if (!role) return;

    let interaction_member = interaction.member;

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
