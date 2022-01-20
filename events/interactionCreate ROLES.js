class Event {
  constructor() {}

  async execute(bot, mongo, interaction) {
    if (!interaction.isButton()) return;

    if (!interaction.channel.id != "652521261058228236") return;

    let role = interaction.guild.roles.cache.get(interaction.customId);

    if (!role) return;

    let interaction_member = interaction.member;

    interaction.reply({
      content: `Вам выдана роль ${role}`,
      ephemeral: true
    });

    if (interaction_member.roles.cache.has(role.id)) {
      return interaction_member.roles.remove(role.id);
    }

    interaction_member.roles.add(role.id);
  }
}
module.exports = (...args) => {
  new Event().execute(...args);
};
