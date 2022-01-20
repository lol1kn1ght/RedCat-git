class Event {
  constructor() {}

  async execute(bot, mongo, interaction) {
    console.log(1);
    if (!interaction.isButton()) return;
    console.log(2);

    if (!interaction.channel.id != "652521261058228236") return;
    console.log(3);

    let role = interaction.guild.roles.cache.get(interaction.customID);

    if (!role) return;
    console.log(4);

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
